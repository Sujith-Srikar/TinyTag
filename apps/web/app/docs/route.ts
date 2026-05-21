import { collectRoutes, generateDocsHtml } from "trpc-docs-generator";

import { appRouter } from "../../trpc/router/app";

export async function GET() {
  const routes = collectRoutes(appRouter);

  const html = generateDocsHtml(routes, {
    title: "TinyTags API Docs",
  });

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
