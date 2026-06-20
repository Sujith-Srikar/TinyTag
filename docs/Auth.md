# TinyTags v2 - Authentication Architecture

## Purpose

This document describes the authentication architecture, design decisions, security model, ownership model, and implementation plan for TinyTags v2.

The goal is to provide:

* Frictionless onboarding
* Permanent user accounts
* Ownership-based access control
* Future scalability
* Secure authorization

---

# High-Level Architecture

```text
Browser
   ↓
Supabase Auth
   ↓
Session
   ↓
Next.js App Router
   ↓
tRPC
   ↓
Supabase Database
```

Authentication and database responsibilities remain separate.

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

Used for permanent accounts.

Benefits:

* Recoverable account
* Multi-device access
* Persistent identity
* Future premium features
* Account portability

---

## Anonymous Authentication

Used for frictionless onboarding.

Benefits:

* No signup required
* Instant access
* Faster first-time experience

Limitations:

* Browser-dependent identity
* Difficult recovery
* Not portable across devices

---

# Authentication vs Authorization

## Authentication

Authentication answers:

```text
Who are you?
```

Examples:

* Continue with Google
* Continue as Guest

Authentication establishes identity.

---

## Authorization

Authorization answers:

```text
What are you allowed to do?
```

Examples:

* Can edit link
* Can delete link
* Can access dashboard

Authorization is based on ownership.

---

# User vs Session

## User

A user is a permanent identity.

Stored in:

```text
auth.users
```

Examples:

```text
Google User
Anonymous User
```

A user remains until explicitly deleted.

---

## Session

A session represents a logged-in state.

Contains:

```text
Access Token
Refresh Token
```

Sessions expire.

Users do not.

---

## Relationship

```text
User
 ├── Session 1
 ├── Session 2
 └── Session 3
```

Example:

```text
Chrome
Firefox
Mobile
```

All can belong to the same user.

---

# OAuth Flow

## Google Authentication Flow

```text
User
 ↓
Continue with Google
 ↓
Google Consent Screen
 ↓
Google verifies identity
 ↓
Google returns authorization result
 ↓
Supabase
 ↓
Creates or Fetches User
 ↓
Creates Session
 ↓
Redirects to Callback URL
 ↓
Application
```

Important:

Google does not authenticate the user into TinyTags.

Google only proves identity.

Supabase creates and manages the application session.

---

# Session Lifecycle

## Initial Login

```text
User
 ↓
Login
 ↓
Supabase creates session
 ↓
Session stored in browser
```

Stored information:

```text
Access Token
Refresh Token
```

---

## Page Refresh

```text
Refresh Page
 ↓
Browser sends session
 ↓
Supabase validates session
 ↓
Current user restored
```

The user remains logged in.

---

## Different Browser

```text
Chrome
 ↓
Logged In

Firefox
 ↓
No Session
 ↓
Must Login Again
```

Sessions are browser-specific.

---

## Access Token

Represents proof of identity.

Example:

```text
I am user abc123
```

Used to access protected resources.

Short-lived.

---

## Refresh Token

Used to obtain new access tokens.

Flow:

```text
Access Token Expires
 ↓
Supabase SDK
 ↓
Uses Refresh Token
 ↓
Obtains New Access Token
```

This process is automatic.

Applications rarely handle refresh tokens manually.

---

# Anonymous Authentication

Guest users are real users.

Flow:

```text
Continue as Guest
 ↓
supabase.auth.signInAnonymously()
 ↓
auth.users
 ↓
is_anonymous = true
```

Anonymous users receive:

* User ID
* Session
* Ownership capabilities

---

# Guest vs Google Users

## Guest User

Advantages:

* No signup
* Immediate usage

Disadvantages:

* Browser-dependent
* No account recovery
* Difficult cross-device access

---

## Google User

Advantages:

* Recoverable account
* Persistent ownership
* Multi-device support
* Future premium features

---

# Guest Upgrade Strategy

Goal:

Allow guest users to upgrade without losing ownership.

Desired Flow:

```text
Guest User
 ↓
Creates Links
 ↓
Continue with Google
 ↓
Account Linked
 ↓
Same User ID
```

Requirements:

```text
User ID remains unchanged
```

Benefits:

```text
No migration
No ownership transfer
No broken references
```

All resources remain attached to the same account.

---

# User Storage Strategy

## auth.users

Managed by Supabase.

Purpose:

```text
Authentication Identity
```

Contains:

* id
* email
* provider
* created_at
* is_anonymous

Authentication-related data only.

---

## profiles

Managed by TinyTags.

Purpose:

```text
Application Data
```

Examples:

* display_name
* avatar_url
* theme_preferences
* plan
* onboarding_status

---

## Relationship

```text
auth.users.id
        │
        ▼
profiles.id
```

One-to-one mapping.

---

# Ownership Model

Every link belongs to a user.

Example:

```sql
links (
  id,
  user_id,
  slug,
  destination_url,
  created_at
)
```

Ownership is determined using:

```text
user_id
```

---

# Link Creation Flow

```text
Current User
 ↓
Create Link
 ↓
Store user_id
 ↓
Persist Link
```

Every resource must be tied to an authenticated user.

---

# Authorization Model

## Frontend

Frontend checks are UX only.

Examples:

```text
Hide Delete Button
Hide Edit Button
```

Frontend checks are not security.

---

## Backend

Backend validates ownership.

Example:

```text
Current User
      ==
Link.user_id
```

Backend is a security boundary.

---

## Database

Database provides final protection.

Using:

```text
Row Level Security (RLS)
```

Even if application code contains bugs:

```text
Database
 ↓
Reject Unauthorized Operation
```

---

# Security Principles

## Never Trust Client IDs

Never trust:

```json
{
  "userId": "abc123"
}
```

coming from the frontend.

Users can modify requests.

---

## Always Derive User From Session

Correct flow:

```text
Browser
 ↓
Session Token
 ↓
Backend
 ↓
Supabase validates token
 ↓
Extract User ID
```

The authenticated user must always come from the session.

Never from request payloads.

---

# Planned Database Structure

## Users

Managed by Supabase.

```text
auth.users
```

---

## Profiles

Managed by TinyTags.

```sql
profiles (
  id uuid primary key,
  display_name text,
  avatar_url text,
  created_at timestamptz
)
```

---

## Links

```sql
links (
  id uuid primary key,
  user_id uuid not null,
  slug text not null,
  destination_url text not null,
  created_at timestamptz default now()
)
```

---

# Planned Implementation Order

## Phase 1

Google OAuth

Goals:

* Login
* Logout
* Current User

---

## Phase 2

Anonymous Authentication

Goals:

* Guest Login
* Session Persistence

---

## Phase 3

Protected Routes

Protect:

```text
/dashboard
/links
```

Allow:

```text
/
```

---

## Phase 4

Ownership

Add:

```text
user_id
```

to links.

---

## Phase 5

User-Specific Queries

Show only:

```text
Current User Links
```

---

## Phase 6

Row Level Security

Add:

* Select policies
* Update policies
* Delete policies

---

# Future Improvements

Potential future additions:

* GitHub Login
* Email Login
* Team Workspaces
* Shared Links
* Premium Plans
* API Keys
* User Preferences
* Analytics Ownership

---

# Final Principle

Authentication proves identity.

Authorization protects resources.

Every resource in TinyTags must be owned by a user.

The authenticated user must always be derived from a validated session, never from client-provided data.


-------------

## Why Middleware Instead of Client-Side Route Protection?

Initially, route protection was implemented inside Client Components using:

```ts
auth.auth.getUser()
router.replace("/login")
```

Example:

```txt
/dashboard
      ↓
Component Mounts
      ↓
Auth Check
      ↓
Redirect Login
```

While functional, this approach has several drawbacks.

### Drawbacks of Client-Side Protection

#### 1. Protected Pages Still Mount

The page component is rendered before authentication is verified.

```txt
Request /dashboard
      ↓
Dashboard Loads
      ↓
Auth Check
      ↓
Redirect
```

This can cause:

* Loading flickers
* Unnecessary component rendering
* Poor user experience

---

#### 2. Auth Logic Is Repeated

Every protected page requires:

```ts
auth.auth.getUser()
```

and redirect logic.

Example:

```txt
/dashboard
/settings
/profile
/analytics
```

Each page would need to implement authentication checks individually.

This leads to duplicated code and maintenance overhead.

---

#### 3. Authentication Becomes Scattered

Authentication decisions become distributed throughout the application.

```txt
Dashboard Auth Logic
Settings Auth Logic
Profile Auth Logic
```

Instead of having a single source of truth.

---

#### 4. Future Server Components Cannot Use Client Logic

Client-side protection relies on:

```ts
useEffect()
useRouter()
```

which are unavailable in Server Components.

As the application grows and adopts SSR or Server Components, authentication logic must move closer to the request lifecycle.

---

## Middleware-Based Protection

With middleware:

```txt
Request /dashboard
      ↓
Middleware
      ↓
Validate Session
      ↓
Allow Request
```

or

```txt
Request /dashboard
      ↓
Middleware
      ↓
No Session
      ↓
Redirect /login
```

The protected page never mounts when access is denied.

---

## Benefits of Middleware

### Centralized Authentication

Authentication rules live in one location:

```txt
middleware.ts
```

instead of being duplicated across pages.

---

### Better User Experience

Users are redirected before any page rendering occurs.

No loading flickers.

No temporary dashboard rendering.

---

### Prevents Unnecessary Work

Without middleware:

```txt
Page Mount
 ↓
Data Fetch
 ↓
Auth Check
 ↓
Redirect
```

With middleware:

```txt
Auth Check
 ↓
Redirect
```

The page, queries, and components never execute.

---

### Scales Better

As more protected routes are added:

```txt
/dashboard
/settings
/profile
/links
/analytics
```

only middleware needs to be updated.

---

## Key Takeaway

Client-side protection answers:

> Can this page redirect unauthenticated users?

Middleware answers:

> Should this request be allowed to reach the page at all?

Middleware is preferred because authentication becomes centralized, reusable, scalable, and occurs before protected pages are rendered.


-------------------

Now while creating it is important to specify config, if not proxy (middleware) runs on every request even on HTML request, JS chunks, CSS, Images, Fonts

----------------

# TinyTags Authentication & Authorization Notes

## Goal

Build a production-ready authentication system using:

* Next.js App Router
* Supabase Auth
* tRPC
* Middleware (Proxy)
* Row Level Security (RLS)

while supporting:

* Google Login
* Anonymous Login
* Account Upgrade (Anonymous → Google)
* Protected Routes
* Protected APIs
* User-owned Links

---

# 1. Why Client-Side Route Protection Is Not Enough

## Initial Approach

Dashboard was a client component:

```tsx
const { data: user } = await auth.auth.getUser();

if (!user) {
  router.replace("/auth/login");
}
```

## Problem

The page already mounted before the redirect happened.

This means:

1. React component mounts
2. Queries execute
3. UI loads
4. Redirect happens later

### Consequences

* Unnecessary API requests
* UI flashes
* Protected page code executes
* Not reusable

---

# 2. Why Middleware / Proxy Is Better

Instead of protecting every page:

```tsx
if (!user) {
  router.replace("/auth/login");
}
```

protect the entire application once.

Middleware runs before the page renders.

Flow:

```txt
Request
   ↓
Proxy / Middleware
   ↓
Auth Check
   ↓
Allow OR Redirect
   ↓
Page Render
```

Benefits:

* No UI flash
* No unnecessary queries
* Centralized auth logic
* Reusable

---

# 3. Supabase SSR vs Supabase JS

## Initial Setup

```ts
createClient(...)
```

This works only in the browser.

Tokens were stored in:

```txt
localStorage
```

Server cannot read localStorage.

Result:

```txt
Browser = Authenticated
Server = Anonymous
```

Middleware always saw:

```txt
user = null
```

---

## Solution

Use:

```ts
@supabase/ssr
```

which stores auth state in cookies.

Cookies can be read by:

* Browser
* Server Components
* Route Handlers
* Middleware

Result:

```txt
Browser = Authenticated
Server = Authenticated
```

---

# 4. PKCE Flow

Originally:

```txt
Implicit Flow
```

Later migrated to:

```txt
PKCE Flow
```

Why?

### PKCE

Flow:

```txt
Browser
   ↓
Google
   ↓
Authorization Code
   ↓
Server Callback
   ↓
Session Creation
```

Benefits:

* More secure
* Recommended by Supabase
* Works with SSR
* No token leakage in URL

---

# 5. Auth Callback Route

Created:

```txt
/auth/callback
```

Purpose:

Exchange OAuth code for session.

Flow:

```txt
Login Button
   ↓
Google
   ↓
/auth/callback?code=xxx
   ↓
exchangeCodeForSession()
   ↓
Cookies Created
   ↓
Redirect Dashboard
```

Implementation:

```ts
supabase.auth.exchangeCodeForSession(code);
```

This creates the server-readable session cookie.

---

# 6. Why PKCE Initially Failed

Error:

```txt
PKCE code verifier not found
```

Reason:

Login used:

```ts
createClient()
```

while callback used:

```ts
createServerClient()
```

Verifier was stored in browser storage.

Server couldn't access it.

Solution:

Use:

```ts
createBrowserClient()
```

from:

```txt
@supabase/ssr
```

on client side.

Now verifier is stored in cookies.

---

# 7. Anonymous Authentication

Added:

```ts
supabase.auth.signInAnonymously()
```

Benefits:

* Instant onboarding
* No signup friction
* User can start creating links immediately

Each anonymous user still gets:

```txt
auth.users.id
```

Meaning anonymous users are still real authenticated users.

---

# 8. Upgrading Anonymous Accounts

Requirement:

```txt
Anonymous User
        ↓
Upgrade
        ↓
Google Account
```

without losing data.

Used:

```ts
supabase.auth.linkIdentity({
  provider: "google"
});
```

This merges identities.

Result:

```txt
Guest Account
+
Google Identity
=
Single User
```

Links remain attached to the same user.

---

# 9. Identity Already Exists Error

Possible scenario:

```txt
Google Account
already linked
to another user
```

Error:

```txt
identity_already_exists
```

Observed in URL hash.

Handled through:

```ts
useAuthErrors()
```

Custom hook.

Responsibilities:

* Read hash
* Show toast
* Remove hash from URL

Benefits:

* Cleaner UI
* Centralized error handling
* Reusable

---

# 10. Why Google Skipped Consent Screen

Observed:

```txt
Upgrade → instantly selected account
```

Reason:

Google SSO session already exists.

Google remembered previous login.

Solution:

```ts
queryParams: {
  prompt: "select_account"
}
```

Forces account chooser.

Useful when:

* Multiple Google accounts exist
* User wants another account

---

# 11. tRPC Authentication Context

Created:

```ts
createTRPCContext()
```

Flow:

```txt
Cookie
   ↓
Supabase
   ↓
User
   ↓
tRPC Context
```

Returned:

```ts
{
  user: {
    id,
    email,
    isAnonymous
  }
}
```

Benefits:

Every protected procedure automatically receives:

```ts
ctx.user
```

---

# 12. Protected Procedures

Created:

```ts
protectedProcedure
```

instead of checking manually.

Before:

```ts
if (!user) {
  throw new Error();
}
```

After:

```ts
protectedProcedure
```

Benefits:

* Centralized
* Reusable
* Consistent

---

# 13. Route Protection vs API Protection

Both are required.

## Route Protection

Handled by middleware.

Protects pages.

Example:

```txt
/dashboard
/settings
/analytics
```

---

## API Protection

Handled by tRPC.

Protects server actions.

Example:

```txt
Create Link
Delete Link
Update Link
Get My Links
```

Even if someone bypasses the UI:

```txt
API remains secure
```

---

# 14. User Ownership

Added:

```sql
user_id uuid not null
references auth.users(id)
```

to links table.

Purpose:

Every link belongs to a user.

---

# 15. Multi-Layer Security

TinyTags now uses three layers.

## Layer 1

Middleware

```txt
Protect Pages
```

---

## Layer 2

tRPC Protected Procedures

```txt
Protect APIs
```

---

## Layer 3

RLS Policies

```txt
Protect Database
```

Even if someone bypasses backend logic:

Database still rejects unauthorized access.

---

# 16. Why User ID Leakage Is Not Dangerous

Frontend knows:

```txt
user_id
```

This is normal.

Security should never rely on hiding IDs.

Security comes from:

```txt
Authentication
+
Authorization
```

RLS checks:

```sql
auth.uid() = user_id
```

not:

```txt
"Did attacker guess the ID?"
```

---

# 17. Link Ownership Queries

Instead of:

```ts
.update(...)
.eq("slug", slug)
```

use:

```ts
.update(...)
.eq("slug", slug)
.eq("user_id", userId)
```

Benefits:

Single database query.

No extra fetch required.

Prevents editing another user's data.

Same for:

```ts
delete
update
select
```

---

# 18. Future Folder Structure

Recommended:

```txt
app/
├── layout.tsx
│
├── (public)/
│   └── page.tsx
│
├── (auth)/
│   └── auth/
│       ├── login/
│       └── callback/
│
└── (app)/
    ├── layout.tsx
    ├── dashboard/
    ├── analytics/
    ├── settings/
    └── links/
```

Benefits:

(public)

* Landing pages
* Marketing pages

(auth)

* Login
* Callback

(app)

* Protected authenticated application

URLs remain unchanged.

---

# Key Architectural Decisions

✅ PKCE Flow

✅ Supabase SSR

✅ Middleware Route Protection

✅ tRPC Context Authentication

✅ Protected Procedures

✅ Anonymous Accounts

✅ Account Upgrade Support

✅ User-Owned Data

✅ RLS Security

✅ Route Groups

✅ Centralized Auth Error Handling

---

# Current Authentication Architecture

```txt
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

This is a scalable SaaS authentication architecture and is a solid foundation for future features such as billing, teams, custom domains, API keys, and enterprise plans.
