# TinyTags v2 — Auth & Authorization Notes

**Stack:** Next.js App Router · Supabase Auth · Supabase SSR · tRPC · Middleware · RLS
**Supports:** Google OAuth · Anonymous Auth · Anonymous→Google Upgrade · Protected Routes/APIs · Ownership-Based Access Control

---

## 1. Core Principle

Authentication proves **identity**. Authorization protects **resources**. Every resource belongs to a user. The authenticated user always comes from a **validated session** — never from client-provided data.

**End-to-end flow:**
`Browser → Supabase Auth → Cookies → Middleware → Server Components → tRPC Context → Protected Procedures → RLS → Database`

Auth and data are separate concerns: **Supabase Auth = Identity**, **Supabase Database = Application Data**.

---

## 2. Authentication Methods

| Method | Use case | Pros | Cons |
|---|---|---|---|
| Google OAuth | Permanent account | Recoverable, multi-device, persistent identity, future premium support | Requires signup step |
| Anonymous | Frictionless onboarding | No signup, instant access | Browser-dependent, hard to recover, not portable |

Anonymous users are still **real** authenticated users — `auth.users`, `is_anonymous = true`, created via `supabase.auth.signInAnonymously()`.

| | User | Session |
|---|---|---|
| Stored in | `auth.users` | Access + refresh tokens |
| Represents | Identity | Logged-in state |
| Lifetime | Persists until deleted | Expires |

---

## 3. Why Supabase SSR (Cookies, not localStorage)

| Client | Storage | Browser sees | Server sees |
|---|---|---|---|
| `createClient()` (plain) | localStorage | Authenticated | Anonymous (can't read localStorage) |
| `@supabase/ssr` | Cookies | Authenticated | Authenticated |

Cookies are readable by browser, middleware, route handlers, and server components — that's the whole reason SSR helpers exist.

---

## 4. OAuth (PKCE) — Full Request Chain

```
App → supabase.co/auth/v1/authorize → accounts.google.com (login) → supabase.co/auth/v1/callback (validates code) → my-app.com/auth/callback?code=... → exchangeCodeForSession() → cookies set → redirect /dashboard
```

**Key insight:** Supabase is the OAuth client — not your app. Google only trusts registered OAuth clients; Supabase holds the client secret and does PKCE verification + token exchange before handing control to your app.

**Why `exchangeCodeForSession()` exists:** Google returns an *authorization code*, not a session. `code → exchangeCodeForSession() → access+refresh tokens → cookies → session`. Skip this and the user is "authenticated by Google" but not logged into your app.

### Redirect URI config — two different places (common gotcha)

| Where | What goes there | Why |
|---|---|---|
| Google Cloud Console → Authorized Redirect URI | **Only** `https://PROJECT.supabase.co/auth/v1/callback` | Google redirects to Supabase, never directly to your app's `/auth/callback` |
| Supabase → Auth → URL Configuration → Redirect URLs | Your app's callback URLs (`localhost:3000/auth/callback`, prod domains) | Destinations Supabase is *allowed* to send the user to after OAuth succeeds |

**Bug hit:** prod login redirected to `localhost:3000/?code=...`. Cause: Supabase's **Site URL** (the fallback when no redirect resolves) was still `localhost:3000`. Fix: update Site URL + Redirect URLs in Supabase after every deploy.

---

## 5. Anonymous Login — No Callback Needed

Entirely inside Supabase: `Browser → Supabase → anonymous user created → session returned`. No Google, no redirect, no OAuth callback.

**Why `router.refresh()` was needed:** server components render *before* the anonymous session exists, so they still think `user = null`. `router.refresh()` forces a new request that includes the fresh cookies, so the server finally sees the user. Without it: session exists, but UI stays stale.

---

## 6. Anonymous → Google Upgrade

```ts
supabase.auth.linkIdentity({ provider: "google" })
```
Same user ID throughout — no ownership migration, no data transfer, no broken references.

**Edge cases hit:**
- **Auto-picks a Google account** due to an existing Google SSO session → force the picker with `queryParams: { prompt: "select_account" }`.
- **`identity_already_exists`** — the Google account is already linked to a *different* Supabase user. Handled centrally via `useAuthErrors()`: reads the URL hash, shows a toast, strips the hash from the URL.

---

## 7. Why Middleware, Not Client-Side Protection

| Client-side (`auth.getUser()` + `router.replace()`) | Middleware |
|---|---|
| UI flicker | No page flash |
| Component mounts before redirect | Session checked before request reaches the page |
| Queries fire before redirect | No wasted requests |
| Logic duplicated per page | Centralized, scales better |

Always configure a **matcher** — without one, middleware also runs on every HTML/JS/CSS/image/font request.

**Route groups:** `(public)` landing → `(auth)` login/callback → `(app)` dashboard/analytics/settings/links. Separate layouts, cleaner architecture, URLs unchanged.

---

## 8. tRPC Auth Layer

Context flow: `Cookie → Supabase → User → Context`, exposing `ctx.user` and `ctx.supabase` to every procedure. Use `protectedProcedure` instead of repeating `if (!user)` everywhere — centralized, reusable, consistent.

### Two layers of protection (both required)

| Layer | Protects | Examples |
|---|---|---|
| Middleware | Pages | `/dashboard`, `/analytics`, `/settings` |
| tRPC protected procedures | APIs | `createLink`, `deleteLink`, `updateLink`, `getMyLinks` |

Page protection alone doesn't protect the API — and vice versa.

---

## 9. Ownership Model & RLS

```sql
links (id, user_id, slug, destination_url)
```
Ownership = `user_id`.

| Operation | Policy |
|---|---|
| Select | `auth.uid() = user_id` — read only your own rows |
| Insert | `with check (auth.uid() = user_id)` — can only create rows for yourself |
| Update | `using (auth.uid() = user_id) with check (auth.uid() = user_id)` — edit your own rows, can't transfer ownership |
| Delete | `using (auth.uid() = user_id)` — delete only your own rows |

**Why RLS "broke everything":** a plain `createClient()` doesn't carry the session, so `auth.uid()` evaluates to `null` → `null = user_id` is always `false` → zero rows returned even though data exists. Debug with `select auth.uid();` — if it returns `null`, no authenticated session reached the database. (Root cause of `getMyLinks()` returning `[]`.)

---

## 10. Public vs Protected Queries

| Type | Examples | Client | Why |
|---|---|---|---|
| Public | `slugExists`, `getRedirectUrl`, `incrementClickCount` | Shared/public client | No ownership check needed |
| Protected | `getMyLinks`, `createShortUrl`, `editLongUrl`, `deleteUrl` | `ctx.supabase` (cookie-bound) | RLS needs `auth.uid()`, which only resolves with an authenticated cookie session |

**Public redirects for anonymous visitors:** RLS blocks anonymous `select * from links` for `/some-slug`. Fix: a `security definer` function `get_redirect_url(slug)` that bypasses RLS but returns **only** `destination_url`, nothing else.

---

## 11. Three Supabase Clients

| Client | Created with | Used for | Storage |
|---|---|---|---|
| Browser | `createClient()` | Login, logout, linkIdentity, anonymous auth | Browser (localStorage) |
| Server | `createServerClient()` in `utils/auth/server.ts` | Route handlers, server components, tRPC context | Cookies via `cookies()` |
| Middleware | `createServerClient()` in `proxy.ts` | Route protection, session refresh, JWT validation | `request.cookies` / `response.cookies` |

Three clients exist because each runtime has a different cookie API — `cookies()` isn't available inside middleware, which instead reads/writes `request.cookies` and `response.cookies` directly.

---

## 12. Multi-Layer Security Summary

| Layer | Boundary |
|---|---|
| 1. Middleware | Protects pages |
| 2. tRPC protected procedures | Protects APIs |
| 3. RLS | Protects the database — **final boundary**, holds even if 1 & 2 are bypassed |

**Debug order when auth breaks:** `Session → Cookie → Context → auth.uid() → RLS`.

---

## 13. Key Decisions

✅ Supabase SSR · ✅ PKCE OAuth Flow · ✅ Google Login · ✅ Anonymous Login · ✅ Anonymous → Google Upgrade · ✅ Middleware Route Protection · ✅ tRPC Protected Procedures · ✅ User-Owned Resources · ✅ RLS Authorization · ✅ Route Groups · ✅ Centralized Auth Error Handling · ✅ Public Redirect Function · ✅ Cookie-Based Sessions · ✅ Multi-Layer Security

**Keywords:** Supabase SSR, PKCE Flow, OAuth Callback, Anonymous Auth, Account Linking, Identity Already Exists, Middleware vs Client Auth, Protected Procedures, tRPC Context, Row Level Security, auth.uid(), Security Definer Function, Public Redirect Architecture, Ownership Model, Route Groups, Multi-Layer Security