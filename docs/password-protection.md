# Password Protection

Link owners can password-protect a short link. Visitor enters password once; a verification cookie skips the prompt for 24h.

## Flow

`[slug]` GET → `resolveRedirectData(slug)` (cache → DB fallback, cache result) → if `hasPassword`, check `isPasswordVerified` (cookie `tinytag-pw-{slug}` compared to stored `passwordToken` via `timingSafeEqual`, length pre-check first) → verified: redirect to `destinationUrl`; unverified: redirect to `/password/{slug}` → form calls `verifyPassword` mutation → argon2 verify → success sets cookie to `passwordToken`, returns `redirectUrl`; failure → `UNAUTHORIZED`.

## Data model

- `links` columns: `password_hash text`, `password_token text`, `has_password boolean`
- CHECK constraint: `has_password` true ⇔ both hash+token set, false ⇔ both null
- `password_token` is a shared secret between DB and cookie, not a session id — rotates on password change, invalidating old cookies automatically (no cleanup needed)

## Three-state edit semantics (`editLongUrl`)

| `password` field | Meaning | `hashedPassword` | `passwordToken` |
|---|---|---|---|
| `undefined` | leave unchanged | `undefined` | `undefined` |
| `null` | remove password | `null` | `null` |
| `"abc"` | set/replace | `argon2("abc")` | new token |

Schema: `password: z.union([z.string(), z.null()]).optional()`

## Key functions/endpoints

- `shortenUrl` / `editLongUrl` (tRPC, protected): hash password (`@node-rs/argon2`), generate token (`createPasswordToken()` — 24 bytes CSPRNG, base64url), write via `create_short_url`/`edit_long_url`
- `verifyPassword` (tRPC, public): `getLinkPasswordBySlug` → 404 if no password set → argon2 verify → set cookie → return redirect URL (also fires click increment)
- `getLinkBySlug` / `getLinkPasswordBySlug` — both backed by RPC `get_redirect_url`
- Cache (`RedirectSchema`) stores `passwordToken` alongside `destinationUrl`/`expiresAt`/`hasPassword`, 24h TTL; invalidated on edit/delete

## Security

- Argon2 (memory-hard, salted) for hashing
- 192-bit CSPRNG token, base64url
- Cookie: `httpOnly`, `secure` in prod, `sameSite: lax`, 1-day TTL
- Constant-time comparison (`timingSafeEqual`)
- Parameterized queries (Supabase)
- `userId` always server-set

## File map

| File | Role |
|---|---|
| `packages/shared/src/types/common.ts` | `RedirectData`, `LinkBuilderFormSchema`, `LinkMutationInput` |
| `packages/shared/src/constants.ts` | `COOKIE_PREFIX`, `COOKIE_MAX_AGE` |
| `packages/db/src/queries/public.queries.ts` | `getLinkBySlug`, `getLinkPasswordBySlug` |
| `packages/db/src/queries/protected.queries.ts` | `create_short_url`, `edit_long_url` |
| `packages/db/supabase/migrations/20260729063919_*.sql` | `password_token` column + consistency constraint |
| `packages/cache/src/schema.ts` | `RedirectSchema` |
| `apps/web/utils/password.ts` | `createPasswordToken()`, `createPasswordCookieName()` |
| `apps/web/trpc/router/post.ts` | `shortenUrl`, `editLongUrl`, `verifyPassword` |
| `apps/web/app/[slug]/route.ts` | `isPasswordVerified`, `resolveRedirectData` |
| `apps/web/app/(public)/password/[slug]/page.tsx` | Password entry form |
| `apps/web/features/components/links/sections/PasswordSection.tsx` | Password UI dialog |