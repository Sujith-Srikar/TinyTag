FROM node:22-alpine AS base
WORKDIR /app
# Alpine Linux uses musl instead of the standard glibc library; But turborepo binaries require glibc; so libc6-compact
# corepack manages package managers, activates pre-bundled verions of pnpm and yarn
RUN apk add --no-cache libc6-compat \
    && npm install -g pnpm turbo 

FROM base AS turbo
COPY . .
RUN turbo prune web --docker

FROM base AS installer
COPY --from=turbo /app/out/json .
COPY --from=turbo /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=turbo /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=turbo /app/out/full/ .
COPY package.json turbo.json ./
RUN pnpm install --frozen-lockfile
RUN --mount=type=secret,id=env \
    export $(cat /run/secrets/env | xargs) && \
    pnpm run build

FROM base AS runner
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
CMD ["node", "apps/web/server.js"]