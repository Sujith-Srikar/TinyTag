import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRedirectData, setRedirectData, deleteData } from "@repo/cache";
import { StatusCode, createErrorResponse, logger, createPerformance } from "@repo/shared";
import { getLinkBySlug, updateClicksCount } from "@repo/db";
import { type Redirect } from "@repo/cache";

const COOKIE_PREFIX = "tinytag-pw-";

export async function GET(req: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const perf = createPerformance("redirect", { slug });

  try {
    if (!slug || slug.includes(".")) {
      logger.warn("Redirect attempted without slug", slug);
      return NextResponse.json(
        createErrorResponse("Slug is not given"),
        { status: StatusCode.BAD_REQUEST },
      );
    }

    const redirectData = await resolveRedirectData(slug, perf);

    if (!redirectData) {
      logger.warn("Slug not found", { slug });
      perf.finish({ cache: "miss", lookup: "miss" });
      return NextResponse.redirect(new URL("/link-unavailable?reason=not-found", req.url));
    }

    if (isExpired(redirectData)) {
      logger.info("Link expired", { slug });
      void deleteData(slug);
      perf.finish({ status: "expired" });
      return NextResponse.redirect(new URL("/link-unavailable?reason=expired", req.url));
    }

    if (redirectData.hasPassword) {
      const verified = await isPasswordVerified(slug);

      if (!verified) {
        perf.finish({ status: "password_required" });
        return NextResponse.rewrite(new URL(`/password/${slug}`, req.url));
      }
    }

    void updateClicksCount(slug).catch((err) =>
      logger.error("Failed to increment click count", { slug, err }),
    );

    perf.finish({ status: "redirect" });
    return NextResponse.redirect(redirectData.destinationUrl, 302);
  } catch (error) {
    logger.error("Redirect route failed", {
      slug,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      cause: error instanceof Error && "cause" in error ? error.cause : undefined,
    });
    perf.finish({ status: "error" });
    return NextResponse.redirect(new URL("/link-unavailable?reason=not-found", req.url));
  }
}

async function resolveRedirectData(
  slug: string,
  perf: ReturnType<typeof createPerformance>,
): Promise<Redirect | null> {
  const cached = await perf.measure("redis", () => getRedirectData(slug));
  if (cached) return cached;

  const dbData = await perf.measure("db", () => getLinkBySlug(slug));
  if (!dbData) return null;

  const ttl = dbData.expiresAt
    ? Math.max(0, Math.floor((new Date(dbData.expiresAt).getTime() - Date.now()) / 1000))
    : undefined;

  void setRedirectData(slug, dbData, ttl).catch((err) =>
    logger.error("Failed to cache redirect", { slug, err }),
  );
  return dbData;
}

function isExpired(data: Redirect): boolean {
  return Boolean(data.expiresAt && new Date(data.expiresAt) < new Date());
}

async function isPasswordVerified(slug: string): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(`${COOKIE_PREFIX}${slug}`)?.value === "1";
}
