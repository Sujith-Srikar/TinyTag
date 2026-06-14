# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo build
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo build
bun dlx turbo build
bun exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo build --filter=docs
```

Without global `turbo`:

```sh
npx turbo build --filter=docs
bun exec turbo build --filter=docs
bun exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo dev
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo dev
bun exec turbo dev
bun exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo dev --filter=web
```

Without global `turbo`:

```sh
npx turbo dev --filter=web
bun exec turbo dev --filter=web
bun exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo login
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo login
bun exec turbo login
bun exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo link
```

Without global `turbo`:

```sh
npx turbo link
bun exec turbo link
bun exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)

```
├── apps/
│   └── web/
│       ├── app/
│       │   ├── [slug]/
│       │   │   └── route.ts
│       │   ├── api/
│       │   │   └── trpc/
│       │   │       └── [trpc]/
│       │   │           └── route.ts
│       │   ├── dashboard/
│       │   │   └── page.tsx
│       │   ├── docs/
│       │   │   └── route.ts
│       │   ├── links/
│       │   │   └── [id]/
│       │   │       ├── page.module.scss
│       │   │       └── page.tsx
│       │   ├── globals.scss
│       │   ├── layout.tsx
│       │   ├── not-found.tsx
│       │   ├── page.module.css
│       │   └── page.tsx
│       ├── components/
│       │   ├── Layout/
│       │   │   ├── NotFound/
│       │   │   │   ├── Model.tsx
│       │   │   │   ├── NotFoundPage.tsx
│       │   │   │   └── Scene.tsx
│       │   │   ├── Sidebar/
│       │   │   │   ├── Sidebar.module.scss
│       │   │   │   └── Sidebar.tsx
│       │   │   ├── TopBar/
│       │   │   │   ├── TopBar.module.scss
│       │   │   │   └── TopBar.tsx
│       │   │   └── index.ts
│       │   └── UI/
│       │       ├── Logo/
│       │       │   ├── Logo.module.scss
│       │       │   └── Logo.tsx
│       │       ├── Modal/
│       │       │   ├── DeleteConfirmModal.module.scss
│       │       │   ├── DeleteConfirmModal.tsx
│       │       │   ├── Modal.module.scss
│       │       │   ├── Modal.tsx
│       │       │   ├── ModalParts.module.scss
│       │       │   └── ModalParts.tsx
│       │       ├── ThemeToggle/
│       │       │   ├── ThemeToggle.module.scss
│       │       │   └── ThemeToggle.tsx
│       │       └── index.ts
│       ├── features/
│       │   └── components/
│       │       ├── dashboard/
│       │       │   ├── LinkCard/
│       │       │   │   ├── page.module.scss
│       │       │   │   └── page.tsx
│       │       │   ├── LinkList/
│       │       │   │   ├── page.module.scss
│       │       │   │   └── page.tsx
│       │       │   ├── StatsBar/
│       │       │   │   ├── page.module.scss
│       │       │   │   └── page.tsx
│       │       │   └── index.ts
│       │       └── links/
│       │           ├── sections/
│       │           │   ├── CommentSection.tsx
│       │           │   ├── DestinationSection.tsx
│       │           │   ├── index.ts
│       │           │   ├── QrCodeSection.tsx
│       │           │   └── ShortLinksSection.tsx
│       │           ├── LinkBuilder.module.scss
│       │           └── LinkBuilder.tsx
│       ├── hooks/
│       │   ├── useLinkBuilder.ts
│       │   └── useSlugGenerator.ts
│       ├── providers/
│       │   ├── Providers.tsx
│       │   ├── ThemeProvider.tsx
│       │   └── TRPCProvider.tsx
│       ├── public/
│       │   ├── fonts/
│       │   │   └── PPNeueMontreal-Regular.ttf
│       │   └── media/
│       │       └── shards.glb
│       ├── trpc/
│       │   ├── router/
│       │   │   ├── app.ts
│       │   │   ├── get.ts
│       │   │   └── post.ts
│       │   ├── client.ts
│       │   └── init.ts
│       ├── types/
│       │   └── linkBuilder.ts
│       ├── utils/
│       │   ├── formatters.ts
│       │   └── generate-slug.ts
│       ├── .gitignore
│       ├── components.json
│       ├── eslint.config.js
│       ├── next.config.js
│       ├── package.json
│       ├── postcss.config.mjs
│       ├── README.md
│       └── tsconfig.json
├── packages/
│   ├── cache/
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   ├── index.ts
│   │   │   ├── schema.ts
│   │   │   └── service.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── db/
│   │   ├── src/
│   │   │   ├── queries/
│   │   │   │   └── index.ts
│   │   │   ├── client.ts
│   │   │   ├── index.ts
│   │   │   └── types.ts
│   │   ├── supabase/
│   │   │   ├── migrations/
│   │   │   │   ├── 20260516170122_create_links_table.sql
│   │   │   │   ├── 20260531034846_rename-link-columns.sql
│   │   │   │   ├── 20260531042533_rename-description-to-comments.sql
│   │   │   │   └── 20260531052151_add-isActive-column.sql
│   │   │   └── config.toml
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── eslint-config/
│   │   ├── base.js
│   │   ├── next.js
│   │   ├── package.json
│   │   ├── react-internal.js
│   │   └── README.md
│   ├── shared/
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── common.ts
│   │   │   │   └── web.ts
│   │   │   ├── constant.ts
│   │   │   ├── env.ts
│   │   │   ├── index.ts
│   │   │   └── logger.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── typescript-config/
│   │   ├── base.json
│   │   ├── nextjs.json
│   │   ├── package.json
│   │   └── react-library.json
│   └── ui/
│       ├── src/
│       │   ├── components/
│       │   │   ├── badge.tsx
│       │   │   ├── button.tsx
│       │   │   ├── field.tsx
│       │   │   ├── infotooltip.tsx
│       │   │   ├── input.tsx
│       │   │   ├── label.tsx
│       │   │   ├── separator.tsx
│       │   │   ├── textarea.tsx
│       │   │   └── tooltip.tsx
│       │   ├── lib/
│       │   │   └── utils.ts
│       │   └── index.ts
│       ├── eslint.config.mjs
│       ├── package.json
│       └── tsconfig.json
├── .gitignore
├── .npmrc
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
├── turbo.json
└── vercel.json

```