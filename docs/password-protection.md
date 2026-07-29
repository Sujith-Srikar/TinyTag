# Password Protection

## Intent

Let link owners set a password on a short link. Visitors must enter it once to proceed; a verification cookie skips the prompt on subsequent visits for 24 hours.

---

## Flow

```
Visitor clicks                  Redirect
password-protected              to destination
       │                            ▲
       ▼                            │
  [slug] GET                  cookie valid?
       │                      ┌──────┴──────┐
       ▼                      yes            no
  resolveRedirectData()              ┌──────┘
       │                             ▼
       ▼                    /password/{slug}
  hasPassword? ──no──> redirect         │
       │                           enter password
       ▼                              │
  isPasswordVerified()                 ▼
       │                     verifyPassword mutation
  ┌────┴────┐                  argon2 verify
  yes       no                  ┌────┴────┐
  └──▶ ...  └──▶ /password/    fail      ok
                                    │           │
                               "Invalid"  set cookie
                                          redirect
```

---

## Layer by Layer

### DB (`packages/db/`)

- Table `links` columns: `password_hash text`, `password_token text`, `has_password boolean`
- CHECK constraint `links_password_consistency` enforces:
  - `has_password = false` ⇔ `password_hash IS NULL AND password_token IS NULL`
  - `has_password = true` ⇔ `password_hash IS NOT NULL AND password_token IS NOT NULL`
- RPC `get_redirect_url` returns all three; called by both `getLinkBySlug` (→ `RedirectData` with `passwordToken`) and `getLinkPasswordBySlug` (→ `{passwordHash, passwordToken, destinationUrl}`)
- `create_short_url` / `edit_long_url` take `LinkMutationInput`, map fields to snake_case internally — no business logic

### Cache (`packages/cache/`)

- `RedirectSchema` includes `passwordToken: z.string().nullable()` — validated on every cache read
- `passwordToken` cached alongside `destinationUrl`, `expiresAt`, `hasPassword` in Redis (24h TTL, capped by link expiry)
- Cache invalidated on edit (`deleteData(slug)`) and delete

### tRPC Router (`apps/web/trpc/router/post.ts`)

**`shortenUrl`** (protected):
- `password` from form → `hash(password)` via `@node-rs/argon2` → `hashedPassword`
- If hash produced → `createPasswordToken()` (CSPRNG 24 bytes, base64url)
- Builds `LinkMutationInput` → `create_short_url`

**`editLongUrl`** (protected):
- Three-state `hashedPassword` / `passwordToken`:
  - `undefined` — leave as-is (password form field not dirty)
  - `null` — remove password (clears hash, token, flips `has_password` to false)
  - `string` — set new password (hash + new token)
- Cache invalidated after edit

**`verifyPassword`** (public):
- Looks up `getLinkPasswordBySlug(slug)`
- Guards: `!link || !link.passwordHash || !link.passwordToken` → `NOT_FOUND`
- `argon2.verify(link.passwordHash, password)` → `UNAUTHORIZED` on fail
- On success: sets cookie `tinytag-pw-{slug}` = `link.passwordToken` (the stored token, not a fresh one)
- Returns `{redirectUrl: link.destinationUrl}`
- Also increments click count (fire-and-forget)

### Redirect Route (`apps/web/app/[slug]/route.ts`)

- `resolveRedirectData(slug)`: checks Redis cache first, falls back to DB, caches result
- `isExpired(redirectData)`: expired links redirected to `/link-unavailable?reason=expired`
- `hasPassword && passwordToken`: calls `isPasswordVerified({slug, passwordToken})`
- `isPasswordVerified`: reads cookie, compares with `timingSafeEqual` (length pre-check first)
- Verified → redirect to `destinationUrl`; unverified → redirect to `/password/{slug}`

### Password Entry Page (`apps/web/app/(public)/password/[slug]/page.tsx`)

- Client component, calls `verifyPassword` mutation on submit
- On success: `router.push(data.redirectUrl)` — cookie already set by mutation
- On error: displays server error message

### UI Component (`PasswordSection.tsx`)

- Dialog with password input field
- States: new password, mask existing (placeholder), generate, toggle visibility, remove
- `handleRemove`: `setValue('password', null, { shouldDirty: true })`
- `handleMaskFocus` (click into masked field): `setValue('password', undefined)` — reverts to "leave unchanged"
- `handleGeneratePassword`: generates 16-char password + 1 special char, fills field

### Form Schema (`@repo/shared`)

```ts
password: z.union([z.string(), z.null()]).optional()
```
- `undefined` — field never touched (edit, leave unchanged)
- `null` — explicitly removed
- `string` — set/replace

### Types

```ts
LinkMutationInput = Omit<LinkBuilderFields, 'password' | 'hasPassword'>
  & {userId: string; hashedPassword?: string | null; passwordToken?: string | null}
```

### Security

| Layer | Measure |
|-------|---------|
| Hashing | Argon2 via `@node-rs/argon2` (memory-hard, salt) |
| Token | `crypto.randomBytes(24)` — 192-bit CSPRNG, base64url |
| Cookie | `httpOnly`, `secure` in production, `sameSite: lax`, 1-day TTL |
| Comparison | `timingSafeEqual` with length pre-check |
| SQL injection | Supabase parameterized queries throughout |
| Auth | `userId` set server-side, never from client |

### Tokens vs Sessions

No session table or session ID. The `password_token` acts as a shared secret between DB and cookie. On password change, the token rotates → old cookies become invalid automatically. No cleanup needed.

### three-state semantics table

| `password` value | Edit behavior | `hashedPassword` | `passwordToken` |
|---|---|---|---|
| `undefined` | Leave unchanged | `undefined` | `undefined` |
| `null` | Remove password | `null` | `null` |
| `"abc"` | Set/replace | `argon2("abc")` | `createPasswordToken()` |

### File Map

| File | Role |
|------|------|
| `packages/shared/src/types/common.ts` | `RedirectData`, `LinkBuilderFormSchema`, `LinkMutationInput` |
| `packages/shared/src/constants.ts` | `COOKIE_PREFIX`, `COOKIE_MAX_AGE` |
| `packages/db/src/queries/public.queries.ts` | `getLinkBySlug`, `getLinkPasswordBySlug` |
| `packages/db/src/queries/protected.queries.ts` | `create_short_url`, `edit_long_url` |
| `packages/db/supabase/migrations/20260729063919_*.sql` | `password_token` column + consistency constraint |
| `packages/cache/src/schema.ts` | `RedirectSchema` with `passwordToken` |
| `apps/web/utils/password.ts` | `createPasswordToken()`, `createPasswordCookieName()` |
| `apps/web/trpc/router/post.ts` | `shortenUrl`, `editLongUrl`, `verifyPassword` |
| `apps/web/app/[slug]/route.ts` | `isPasswordVerified`, `resolveRedirectData` |
| `apps/web/app/(public)/password/[slug]/page.tsx` | Password entry form |
| `apps/web/features/components/links/sections/PasswordSection.tsx` | Password UI dialog |
