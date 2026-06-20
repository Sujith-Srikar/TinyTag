# TinyTags v2 — Authentication & Authorization Architecture

## Goal

Build a production-grade authentication and authorization system using:

* Next.js App Router
* Supabase Auth
* Supabase SSR
* tRPC
* Middleware (Proxy)
* Row Level Security (RLS)

Supporting:

* Google OAuth
* Anonymous Authentication
* Account Upgrade (Anonymous → Google)
* Protected Routes
* Protected APIs
* Ownership-Based Access Control

---

# Core Principle

Authentication proves identity.
Authorization protects resources.
Every resource must belong to a user.
The authenticated user must always come from a validated session, never from client-provided data.

---

# Authentication Architecture

```text
Browser
   ↓
Supabase Auth
   ↓
Cookies
   ↓
Middleware
   ↓
Server Components
   ↓
tRPC Context
   ↓
Protected Procedures
   ↓
RLS Policies
   ↓
Database
```

Authentication and application data are separate concerns.

```text
Supabase Auth
    ↓
Identity

Supabase Database
    ↓
Application Data
```

---

# Supported Authentication Methods

## Google OAuth

Permanent account.

Benefits:

* Recoverable
* Multi-device access
* Persistent identity
* Future premium support

---

## Anonymous Authentication

Frictionless onboarding.

Benefits:

* No signup
* Instant access

Limitations:

* Browser dependent
* Difficult recovery
* Not portable

Anonymous users are still real authenticated users.

```ts
supabase.auth.signInAnonymously()
```

Creates:

```text
auth.users
is_anonymous = true
```

---

# User vs Session

## User

Stored in:

```text
auth.users
```
Represents identity.

Examples:

* Google User
* Anonymous User

Users persist until deleted.

---

## Session

Contains:

```text
Access Token
Refresh Token
```
Represents logged-in state. Sessions expire; Users do not.

---

# Why Supabase SSR

Using:

```ts
createClient()
```
stores auth in localStorage.

Result:

```text
Browser = Authenticated
Server = Anonymous
```
Middleware cannot read localStorage.

---

Solution:

```ts
@supabase/ssr
```
Stores auth in cookies.

Cookies are readable by:

* Browser
* Middleware
* Route Handlers
* Server Components

Result:

```text
Browser = Authenticated
Server = Authenticated
```

---

# PKCE Authentication Flow

Using:

```text
Google
 ↓
Authorization Code
 ↓
/auth/callback
 ↓
exchangeCodeForSession()
 ↓
Cookies
 ↓
Session
```

Benefits:

* Recommended by Supabase
* More secure
* Works with SSR
* No token leakage

---

# OAuth Callback

Route:

```text
/auth/callback
```

Purpose:

```ts
supabase.auth.exchangeCodeForSession(code)
```

Creates the authenticated session cookie and redirects into the application.

---

# Anonymous → Google Upgrade

Goal:

```text
Guest User
 ↓
Creates Links
 ↓
Upgrade
 ↓
Google Account
 ↓
Same User ID
```

No ownership migration.
No data transfer.
No broken references.
Implemented using:

```ts
supabase.auth.linkIdentity({
  provider: "google"
});
```

---

# Google Account Selection

Observed:

```text
Upgrade
 ↓
Automatically chooses Google account
```

Reason:

Existing Google SSO session.

Force chooser:

```ts
queryParams: {
  prompt: "select_account"
}
```

---

# Identity Already Exists

Possible error:

```text
identity_already_exists
```

Meaning:

```text
Google Account
already linked
to another Supabase user
```

Handled using:

```ts
useAuthErrors()
```

Responsibilities:

* Read URL hash
* Show toast
* Remove hash from URL

Centralized auth error handling.

---

# Why Middleware Instead of Client Protection

Client-side:

```ts
auth.getUser()
router.replace(...)
```

Problems:

* UI flicker
* Component mounts first
* Queries execute first
* Logic duplicated everywhere

---

Middleware:

```text
Request
 ↓
Middleware
 ↓
Session Check
 ↓
Allow / Redirect
```

Benefits:

* No page flash
* No wasted requests
* Centralized protection
* Better scalability

---

# Middleware Matcher

Always configure matcher.

Without matcher:

```text
HTML
JS
CSS
Images
Fonts
```

all execute middleware.

Matcher ensures only meaningful routes are checked.

---

# Route Groups

Structure:

```text
app/

(public)
 └── Landing Pages

(auth)
 ├── Login
 └── Callback

(app)
 ├── Dashboard
 ├── Analytics
 ├── Settings
 └── Links
```

Benefits:

* Separate layouts
* Cleaner architecture
* URLs unchanged

---

# tRPC Authentication

Create context:

```ts
createTRPCContext()
```

Flow:

```text
Cookie
 ↓
Supabase
 ↓
User
 ↓
Context
```

Provides:

```ts
ctx.user
ctx.supabase
```

to every procedure.

---

# Protected Procedures

Instead of:

```ts
if (!user)
```

Use:

```ts
protectedProcedure
```

Benefits:

* Centralized
* Reusable
* Consistent

---

# Route Protection vs API Protection

## Route Protection

Handled by:

```text
Middleware
```

Examples:

```text
/dashboard
/analytics
/settings
```

---

## API Protection

Handled by:

```text
tRPC
```

Examples:

```text
Create Link
Delete Link
Update Link
Get My Links
```

Both are required.

---

# Ownership Model

Every link belongs to a user.

```sql
links (
  id,
  user_id,
  slug,
  destination_url
)
```

Ownership determined by:

```text
user_id
```

---

# Row Level Security (RLS)

Policies:

## Select

```sql
auth.uid() = user_id
```

User reads only their rows.

---

## Insert

```sql
with check (
  auth.uid() = user_id
)
```

User can only create rows for themselves.

---

## Update

```sql
using (
  auth.uid() = user_id
)

with check (
  auth.uid() = user_id
)
```

User can update only their own rows and cannot transfer ownership.

---

## Delete

```sql
using (
  auth.uid() = user_id
)
```

User can delete only their own rows.

---

# Public Redirect Function

Problem:

RLS blocks anonymous access.

Need:

```text
/some-slug
```

to work publicly.

Solution:

```sql
security definer
```

function.

```sql
get_redirect_url(slug)
```

Returns destination URL while bypassing RLS safely.

Only exposes redirect target.

Nothing else.

---

# Security Layers

## Layer 1

Middleware

```text
Protect Pages
```

---

## Layer 2

tRPC Protected Procedures

```text
Protect APIs
```

---

## Layer 3

RLS

```text
Protect Database
```

Final security boundary.

---

# Database Access Pattern

Public Queries:

```text
getLinkBySlug
slugExists
updateClicksCount
```

Can use shared/public client.

---

Protected Queries:

```text
getMyLinks
createShortUrl
editLongUrl
deleteUrl
```

Must use:

```ts
ctx.supabase
```

Server client with authenticated cookies.

Reason:

RLS requires:

```sql
auth.uid()
```

Anonymous DB client returns:

```sql
auth.uid() = null
```

and RLS denies access.

---

# Key Decisions

✅ Supabase SSR

✅ PKCE OAuth Flow

✅ Google Login

✅ Anonymous Login

✅ Anonymous → Google Upgrade

✅ Middleware Route Protection

✅ tRPC Protected Procedures

✅ User-Owned Resources

✅ RLS Authorization

✅ Route Groups

✅ Centralized Auth Error Handling

✅ Public Redirect Function

✅ Cookie-Based Sessions

✅ Multi-Layer Security

---

# Search Keywords

* Why Supabase SSR
* PKCE Flow
* OAuth Callback
* Anonymous Authentication
* Account Linking
* Identity Already Exists
* Middleware vs Client Auth
* Protected Procedures
* tRPC Context
* Row Level Security
* auth.uid()
* Security Definer Function
* Public Redirect Architecture
* Ownership Model
* Route Groups
* Multi Layer Security
