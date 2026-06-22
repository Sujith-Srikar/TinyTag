
# TinyTags

> Because nobody should have to send a URL that looks like a stack trace.

I started this project thinking: "How hard can a URL shortener be?" - The universe disagreed.

A few weekends later I somehow found myself debugging:

* OAuth callback URLs
* Cookie synchronization between the browser and server
* Anonymous account upgrades
* Row Level Security (RLS) policies
* Redis cache invalidation
* Middleware authorization
* End-to-end type-safe APIs with tRPC

Turns out shortening URLs was easy. Building everything around it was where the real fun started.

---

## Features

### Link Management

* Create short URLs
* Custom slugs
* Edit destination URLs
* Delete links
* QR Code Generation

### Authentication

* Google OAuth
* Anonymous Login
* Anonymous → Google Account Upgrade
* Cookie-based SSR Authentication
* Protected Routes
* Protected APIs

### Analytics

* Per-link click tracking
* Click counter updates on redirects

### Performance

* Redis redirect caching
* Fast redirect resolution
* Database read reduction

### Security

* Supabase SSR Authentication
* Route Protection Middleware
* tRPC Protected Procedures
* Row Level Security (RLS)
* Ownership-Based Authorization

---

# Architecture Overview

TinyTags follows a serverless-first architecture.

![System design](./docs/architecture.png)

---

# Authentication & Authorization

TinyTags separates authentication from authorization.

Authentication is handled by Supabase Auth.

Authorization is enforced through:

* Middleware
* tRPC Protected Procedures
* Row Level Security (RLS)

Every link belongs to a user.

A user can only access their own links.

For detailed auth flows, PKCE, anonymous users, account linking and RLS policies:

📚 See `/docs/authentication.md`

---

## API Documentation

TinyTags exposes a fully documented tRPC API.

View the interactive API documentation:

```text
https://ttags.vercel.app/docs
https://tiny-tag.vercel.app/docs
```

Base URL:

```text
https://ttags.vercel.app/docs
https://tiny-tag.vercel.app/api/trpc
```

# Project Structure

```txt
apps/
└── web/
    ├── src/
    │   ├── app/
    │   │   ├── (public)/
    │   │   ├── (auth)/
    │   │   ├── (app)/
    │   │   ├── auth/
    │   │   └── s/
    │   │
    │   ├── components/
    │   │
    │   ├── features/
    │   │   ├── links/
    │   │   ├── dashboard/
    │   │   └── analytics/
    │   │
    │   ├── hooks/
    │   ├── trpc/
    │   ├── utils/
    │   └── middleware/
    │
    └── public/

packages/
├── db/
├── cache/
├── shared/
├── ui/
└── types/

docs/
├── authentication.md
├── architecture.png

```

---

# Tech Stack

| Category         | Technology           |
| ---------------- | -------------------- |
| Frontend         | Next.js 15           |
| Language         | TypeScript           |
| API Layer        | tRPC                 |
| Authentication   | Supabase Auth        |
| Database         | Supabase Postgres    |
| Authorization    | RLS                  |
| Cache            | Upstash Redis        |
| State Management | React Query          |
| Hosting          | Vercel               |
| Runtime          | Serverless Functions |

---

# Local Development

Clone the repository:

```bash
git clone https://github.com/Sujith-Srikar/tinytags.git

cd tinytags
```

Install dependencies:

```bash
pnpm install
```

Create environment files:

```bash
cp .env.example .env
```

Start development:

```bash
pnpm dev
```

---

# Documentation

Detailed architecture and design decisions live in the `/docs` folder.

| Document           | Description                 |
| ------------------ | --------------------------- |
| authentication.md  | Auth, OAuth, SSR, RLS       |

---

# Future Improvements

* Custom domains
* QR code Customization
* Advanced analytics
* Link Expiration
* Password Protection
* Link tags and folders
* Bulk import/export

---

## Small README Easter Egg

I would add this at the very bottom:

```md

There are only two hard things in Computer Science:

- Cache invalidation
- Naming things
- Off-by-one errors
```
---

## Contributing

Feel free to submit issues and enhancement requests!

---

## License

This project is open source and available under the MIT License.
