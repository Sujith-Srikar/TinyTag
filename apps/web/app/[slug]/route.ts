import { NextResponse } from "next/server";
import { getRedirectData, setRedirectData } from "@repo/cache";
import { StatusCode, createErrorResponse, logger, createPerformance } from "@repo/shared";
import { getLinkBySlug, updateClicksCount } from "@repo/db";

export async function GET(req: Request, context: { params: Promise<{ slug: string }> }) {

  const { slug } = await context.params;
  const perf = createPerformance("redirect", {slug});

  try {

    if (!slug || slug.includes('.')) {
      logger.warn("Redirect attempted without slug", slug);
      return NextResponse.json(createErrorResponse("Slug is not given"), {status: StatusCode.BAD_REQUEST,});
    }

    const cached = await perf.measure("redis", () => getRedirectData(slug));

    if (cached) {
      logger.info("Redirect cache hit", {slug, destinationUrl: cached.longUrl});
      void updateClicksCount(slug).catch((err) => logger.error("Failed to increment click count", { slug, err }));
      perf.finish({cache: "hit"});
      return NextResponse.redirect(cached.longUrl, 302);
    }

    const destination_url = await perf.measure("db", () => getLinkBySlug(slug),);

    if (!destination_url) {
      logger.warn("Slug not found", { slug });
      perf.finish({cache: "miss", lookup: "miss"});
      return NextResponse.redirect(new URL("/link-not-found", req.url));
    }

    void setRedirectData(slug, destination_url).catch((err) => logger.error("Failed to cache redirect", {slug, err}));
    void updateClicksCount(slug).catch((err) => logger.error("Failed to increment click count", { slug, err }));

    perf.finish({cache: "miss", lookup: "hit"});
    return NextResponse.redirect(destination_url, 302);
  } catch (error) {

    const { slug } = await context.params;
    logger.error("Redirect route failed", 
    {
      slug, 
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      cause: error instanceof Error && "cause" in error ? error.cause : undefined
    });
    perf.finish({status: "error"})
    return NextResponse.redirect(new URL("/link-not-found", req.url));
  }
}
