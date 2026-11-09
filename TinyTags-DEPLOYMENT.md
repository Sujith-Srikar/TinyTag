# TinyTags — EC2 Deployment Record

- **Date:** 2026-09-13
- **Target:** `ec2-13-201-242-135.ap-south-1.compute.amazonaws.com` (Amazon Linux 2023, x86_64, 7.6 GiB RAM)
- **SSH:** `ssh -i "Latency-test-1.pem" ec2-user@<host>`
- **Repo / branch / commit:** `Sujith-Srikar/TinyTag`, `dev`, `41f5580` (+1 local fix, see §7)
- **Constraints honored:** no Docker anywhere, Redis runs locally on the box, zero app-code changes except one approved 1-line health-probe fix.

## 1. Final architecture

```text
Browser ──► EC2 :3000 (Next.js standalone, tinytag.service)
                │
                ▼
           127.0.0.1:8079 (up-redis REST gateway, upredis.service)
                │
                ▼
           127.0.0.1:6379 (redis-server 8.10.1, redis.service)
                │
                │ HTTPS
                ▼
           Supabase Cloud (PostgreSQL + Auth) — unchanged
```

The app still uses `@upstash/redis` untouched; the gateway speaks the Upstash REST
protocol locally, so `UPSTASH_REDIS_REST_URL=http://127.0.0.1:8079`.

## 2. Baseline audit (what the box already had)

| Item | State |
|---|---|
| Amazon Linux 2023, kernel 6.18, systemd 252, passwordless sudo | ✅ present |
| Node v22.23.2, npm 10.9.8, git 2.50.1, gcc 11.5, make 4.3, python3 3.9 | ✅ present |
| pnpm | ❌ installed (`npm i -g pnpm@10.15.0`) |
| redis-server | ❌ not in AL2023 repos → built from source (see §3) |
| Bun | ❌ installed via bun.sh script → `~/.bun/bin/bun`, v1.4.2 |
| unzip, dos2unix, golang not needed in the end (see §7) | installed unzip + dos2unix via dnf |

## 3. What was installed (no Docker)

| Component | Version / source | Location |
|---|---|---|
| pnpm | 10.15.0 (repo `packageManager` pin) | global npm |
| Redis | **8.10.1**, built from `download.redis.io/redis-stable.tar.gz` with `BUILD_WITH_MODULES=no` (default build tries to fetch bloom/search/JSON/TS modules and fails; core server is unaffected) | `/usr/local/bin/redis-server`, config `/etc/redis/redis.conf` (bind 127.0.0.1, RDB in `/var/lib/redis`), runs as system user `redis` |
| Bun | 1.4.2 | `/home/ec2-user/.bun/bin/bun` |
| up-redis (Upstash-REST-compatible gateway) | `Coriou/up-redis` @ main, `bun install` (13 pkgs), runs `bun run src/index.ts` | `/opt/up-redis`, token in `/opt/up-redis/gateway.env` (600) |
| TinyTags | clone of `dev` @ `41f5580` | `/home/ec2-user/TinyTags` |
| Production env | copied from local `.env.docker` via `scp`, see §5 | `/home/ec2-user/tinytag-env/production.env` (600) |

## 4. Final file structure (on server)

```text
/home/ec2-user/
├── TinyTags/                          # git clone, branch dev (pristine except §7 fix)
│   ├── apps/web/
│   │   └── .next/
│   │       ├── standalone/            # production runtime root
│   │       │   └── apps/web/
│   │       │       ├── server.js      # <-- tinytag.service entrypoint
│   │       │       ├── .next/static/  # copied in (Dockerfile-runner layout)
│   │       │       └── public/        # copied in
│   │       └── static/
│   ├── packages/
│   └── ...
├── tinytag-env/
│   └── production.env                 # 11 KEY=VALUE lines, LF, 600 (see §5)
├── .bun/                              # Bun 1.4.2
└── .npm-global/ (pnpm 10.15.0 via npm root)

/opt/up-redis/                         # gateway source + node_modules
├── src/index.ts                       # entrypoint (upredis.service)
├── gateway.env                        # UPREDIS_TOKEN / UPREDIS_REDIS_URL / UPREDIS_PORT=8079 / UPREDIS_HOST=127.0.0.1 (600)

/etc/redis/redis.conf                  # bind 127.0.0.1:6379
/var/lib/redis/                        # RDB snapshots (user redis)
/usr/local/bin/redis-{server,cli,check-aof,check-rdb,benchmark}

/etc/systemd/system/
├── redis.service                      # Type=simple, User=redis
├── upredis.service                    # After= + Requires= redis.service, User=ec2-user
└── tinytag.service                    # After= + Requires= upredis.service, PORT=3000,
                                       # EnvironmentFile=~/tinytag-env/production.env
```

## 5. Environment map (`tinytag-env/production.env`, values not recorded here)

Carried over byte-identical from local `.env.docker`:
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET`,
`SRH_MODE`, `SRH_TOKEN`, `SRH_CONNECTION_STRING` (vestigial, unused by gateway),
`ENABLE_PERFORMANCE`.

Changed / added:
`UPSTASH_REDIS_REST_URL=http://127.0.0.1:8079`,
`UPSTASH_REDIS_REST_TOKEN=<random 32-byte hex, matches /opt/up-redis/gateway.env>`,
`NODE_ENV=production` (was absent; required by `@repo/shared/env/server.ts` validation).

Notes: source file had Windows CRLF → normalized with `dos2unix` (a naive `tr -d \r`
through the Windows SSH layer ate `r` letters — file was re-transferred and converted
properly). Next.js reads env only from `apps/web/` or the process environment, so the
clone contains **no** `.env.local`; the single source of truth is `production.env`,
exported for `pnpm build` and referenced via `EnvironmentFile=` at runtime.

## 6. Services & runbook

Boot order enforced by systemd: `redis.service` → `upredis.service` → `tinytag.service`
(all `enabled` = survive reboot; `Restart=always`).

```bash
sudo systemctl status redis upredis tinytag
sudo systemctl restart tinytag        # redeploy / pick up env changes (rebuild first if code changed)
sudo systemctl restart upredis redis  # careful: Requires= cascades stops downward
sudo journalctl -u tinytag -f         # app logs (Next.js + perf lines)
sudo journalctl -u upredis -f         # gateway logs
redis-cli ping                        # expect PONG
curl -s http://127.0.0.1:3000/health  # expect {"status":"ok",...}
```

Rebuild + redeploy app after a code change:

```bash
cd ~/TinyTags && git pull
set -a; . ~/tinytag-env/production.env; set +a
pnpm install --frozen-lockfile && pnpm turbo build --filter=web
cd apps/web && cp -r .next/static .next/standalone/apps/web/.next/static \
  && cp -r public .next/standalone/apps/web/public
sudo systemctl restart tinytag
```

## 7. Deviations from the original plan (all approved during deploy)

1. **SRH → up-redis.** SRH is Elixir-only (no Go branch, no prebuilt binaries);
   AL2023 has no Erlang/Elixir packages, so building it means compiling OTP from
   source. `up-redis` (Hono/Bun, validated against the real `@upstash/redis` SDK)
   needs only Bun's single-binary install. App-facing env contract is identical.
2. **Redis from source.** `redis` is not in AL2023's default repos (`dnf list redis`
   → no match). Built 8.10.1 with system gcc/make.
3. **Health-probe bug fix (1 line, also applied to the local repo — uncommitted).**
   `packages/db/src/queries/public.queries.ts:5` probed with `.select("1")`, which
   PostgREST parses as *column named `1`* → `column links.1 does not exist`, so
   `/health` reported `db: unhealthy` on every environment including Vercel.
   Fixed to `.select("id")` (uuid PK, cheapest valid probe). Real queries were never
   affected.
4. **No `.env.local` in the clone; app binds `0.0.0.0:3000`** (binding 127.0.0.1 would
   make SG port 3000 unreachable). Gateway/Redis stay on 127.0.0.1.
5. **SSH quoting workaround (for future remote work):** PowerShell 5.1 mangles `"`,
   `'`, `\` when invoking native `ssh`. All remote file-writing used quote-free
   `echo` lines; secrets moved via `scp`; complex JSON bodies via a local `.mjs`
   file transferred with `scp` and run with system `node` (never paste secrets or
   quote-heavy payloads into SSH command lines).

## 8. Verification evidence (2026-09-13, all server-side)

- `redis-cli ping` → `PONG`
- Gateway REST: `PING`→`PONG`, `SET`→`OK`, `GET`→value, `DEL`→1; `/health` → redis connected
- `pnpm turbo build --filter=web` → 1 successful; standalone 64M
- `GET /` → 200; `GET /health` → `{"status":"ok", cache healthy, db healthy}`
- Cache MISS: `GET /no-such-slug-verify123` → **307** `/link-unavailable?reason=not-found`
- Cache HIT: REST-wrote app-format `redirect:verify-hit-test` → `GET /verify-hit-test` → **302 `https://example.com/`** → key deleted
- Supabase from EC2: HTTPS reachable, anon key valid, `links` readable
- `systemctl restart tinytag` → active, healthy; `journalctl -p err` clean for app + redis
- Listeners: `0.0.0.0:3000`, `127.0.0.1:6379`, `127.0.0.1:8079` (+22)

## 9. Your action items (outside SSH)

1. **Security group:** open inbound **TCP 3000** (keep 6379/8079 closed — they bind localhost only).
2. **Browser click-through:** Google login, anonymous auth, dashboard, create/edit/delete link, real redirect, click counts.
3. **Local repo:** one uncommitted change — the health-probe fix (`git diff` to review, commit/push when ready).
