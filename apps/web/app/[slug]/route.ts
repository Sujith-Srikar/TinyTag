import { NextResponse } from "next/server";
import { getRedirectData, setRedirectData } from "@repo/cache";
import { StatusCode, createErrorResponse, logger } from "@repo/shared";
import { getLinkBySlug, updateClicksCount } from "@repo/db";

export async function GET(req: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      logger.warn("Redirect attempted without slug", slug);
      return NextResponse.json(createErrorResponse("Slug is not given"), {status: StatusCode.BAD_REQUEST,});
    }

    const cached = await getRedirectData(slug);

    if (cached) {
      logger.info("Redirect cache hit", {slug, destinationUrl: cached.longUrl});
      void updateClicksCount(slug).catch((err) => logger.error("Failed to increment click count", { slug, err }),);
      return NextResponse.redirect(cached.longUrl, 302);
    }

    const destination_url = await getLinkBySlug(slug);

    if (!destination_url) {
      logger.warn("Slug not found", { slug });
      return NextResponse.redirect(new URL("/link-not-found", req.url));
    }

    void setRedirectData(slug, destination_url).catch((err) => logger.error("Failed to cache redirect", {slug, err}));
    void updateClicksCount(slug).catch((err) => logger.error("Failed to increment click count", { slug, err }));

    return NextResponse.redirect(destination_url, 302);
  } catch (error) {

    const { slug } = await context.params;
    logger.error("Redirect route failed", {slug, error,});

    return NextResponse.redirect(new URL("/link-not-found", req.url));
  }
}
