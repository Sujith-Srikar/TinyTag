# TinyTags

URL shortener — Next.js 15 + tRPC + Supabase + Upstash Redis.

## Commands

```bash
pnpm install          # install (pnpm@10.15.0, node >=18)
pnpm dev              # dev server on port 3000
pnpm build            # turbo build (standalone output)
pnpm lint             # eslint --max-warnings 0 (web) + per-package
pnpm check-types      # next typegen && tsc --noEmit
pnpm format           # prettier --write "**/*.{ts,tsx,md,scss}"
```

Single-package runs:
```bash
pnpm --filter web dev
pnpm --filter web lint
pnpm --filter web check-types
```

Database migrations (requires linked Supabase project):
```bash
cd packages/db
pnpm db:push          # push migrations
pnpm db:types         # regenerate types.ts from schema
```

## Structure

```
apps/web/             # Next.js app (no src/ — code lives directly here)
packages/
  db/                 # Supabase client + queries + migrations
  cache/              # Upstash Redis client + redirect caching
  shared/             # Env validation, types, constants, logger
  ui/                 # Shared UI components (shadcn/radix based)
  eslint-config/      # Shared ESLint flat configs
  typescript-config/  # Shared tsconfig bases
```

## Key gotchas

- **Zod v4** — not v3. Schema syntax differs (`z.url()` instead of `z.string().url()`, `z.union()` for optional strings).
- **No `src/` directory** — app code lives directly in `apps/web/` (e.g., `apps/web/trpc/`, `apps/web/app/`, `apps/web/components/`).
- **`@/*` alias** resolves to `apps/web/`, not `apps/web/src/`.
- **shadcn/ui** — components live in `@repo/ui` package, imported as `@repo/ui/components/*`. Config in `components.json`.
- **ESLint** — flat config format. Next.js config imported from `@repo/eslint-config/next-js`.
- **DB columns are snake_case** (`destination_url`, `clicks_count`, `user_id`). tRPC router maps to camelCase.
- **Env vars validated at module load** via Zod in `@repo/shared/env/client.ts` and `@repo/shared/env/server.ts`. Missing vars crash at import time, not at use.
- **Next.js `output: 'standalone'`** — Docker and Vercel use standalone build. Static files copied separately in Dockerfile.
- **Vercel build** — `pnpm turbo build --filter=web` (not full monorepo build).
- **tRPC router** — split into `get` (queries) and `post` (mutations) under `apps/web/trpc/router/`. Protected procedures require auth.
- **Redirect flow** — `apps/web/app/[slug]/route.ts` checks Redis cache first, falls back to DB, then caches result. Uses performance collector. Has expired-link and password-protected link checks. Expired → `/link-unavailable?reason=expired`. Not found → `/link-unavailable?reason=not-found`. Password-protected → rewrite to `/password/{slug}` (cookie `tinytag-pw-{slug}` = "1" means verified). No UI for setting passwords yet.
- **Reserved slugs** — `@repo/shared/constant.ts` defines slugs that cannot be used (auth, dashboard, api, trpc, etc.).
- **No test suite** — no testing framework or test files exist currently.
- **No CI workflows** — no `.github/workflows/` directory.
- **SCSS modules + Tailwind** — both are used. Component styles use `*.module.scss`, utilities use Tailwind classes.

## Environment

Required env vars (see `.env.example`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET`

`@repo/shared/env/server.ts` requires `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.  
`@repo/shared/env/client.ts` requires the three `NEXT_PUBLIC_*` vars.

## Workspace packages

Internal packages use `workspace:*` protocol. Key deps:
- `@repo/cache` → `@repo/shared`
- `@repo/db` → `@repo/shared`
- `web` → all internal packages
- UI components: `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`

----------

# Ponytail, lazy senior dev mode

You are a lazy senior developer. Lazy means efficient, not careless. The best code is the code never written.

Before writing any code, stop at the first rung that holds:

1. Does this need to be built at all? (YAGNI)
2. Does it already exist in this codebase? Reuse the helper, util, or pattern that's already here, don't re-write it.
3. Does the standard library already do this? Use it.
4. Does a native platform feature cover it? Use it.
5. Does an already-installed dependency solve it? Use it.
6. Can this be one line? Make it one line.
7. Only then: write the minimum code that works.

The ladder runs after you understand the problem, not instead of it: read the task and the code it touches, trace the real flow end to end, then climb.

Bug fix = root cause, not symptom: a report names a symptom. Grep every caller of the function you touch and fix the shared function once — one guard there is a smaller diff than one per caller, and patching only the path the ticket names leaves a sibling caller still broken.

Rules:

- No abstractions that weren't explicitly requested.
- No new dependency if it can be avoided.
- No boilerplate nobody asked for.
- Deletion over addition. Boring over clever. Fewest files possible.
- Shortest working diff wins, but only once you understand the problem. The smallest change in the wrong place isn't lazy, it's a second bug.
- Question complex requests: "Do you actually need X, or does Y cover it?"
- Pick the edge-case-correct option when two stdlib approaches are the same size, lazy means less code, not the flimsier algorithm.
- Mark deliberate simplifications that cut a real corner with a known ceiling (global lock, O(n²) scan, naive heuristic) with a `ponytail:` comment naming the ceiling and upgrade path.

Not lazy about: understanding the problem (read it fully and trace the real flow before picking a rung, a small diff you don't understand is just laziness dressed up as efficiency), input validation at trust boundaries, error handling that prevents data loss, security, accessibility, the calibration real hardware needs (the platform is never the spec ideal, a clock drifts, a sensor reads off), anything explicitly requested. Lazy code without its check is unfinished: non-trivial logic leaves ONE runnable check behind, the smallest thing that fails if the logic breaks (an assert-based demo/self-check or one small test file; no frameworks, no fixtures). Trivial one-liners need no test.