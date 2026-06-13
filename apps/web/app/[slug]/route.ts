import { NextResponse } from "next/server";
import { getRedirectData, setRedirectData } from "@repo/cache";
import { StatusCode, createErrorResponse } from "@repo/shared";
import { getLinkBySlug, updateClicksCount } from '@repo/db'

export async function GET(_: Request, context: { params: Promise<{ slug: string; }> }) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(createErrorResponse("Slug is not given"), { status: StatusCode.BAD_REQUEST, });
    }

    const cached = await getRedirectData(slug);

    if (cached) {
      void updateClicksCount(slug).catch((err) => console.log(err))
      return NextResponse.redirect(cached.longUrl, 302);
    }

    const linksData = await getLinkBySlug(slug);

    if (!linksData) {
      return NextResponse.json(createErrorResponse("Slug not found"), { status: StatusCode.NOT_FOUND, });
    }
    const result = await setRedirectData(slug, linksData.destination_url);

    if (!result) {
      return NextResponse.json(createErrorResponse("Unable to cache redirect data"), { status: StatusCode.INTERNAL_SERVER_ERROR, });
    }

    return NextResponse.redirect(linksData.destination_url, 302);
  } catch (error) {
    console.log("Error while redirecting:", error);

    return NextResponse.json(createErrorResponse("Error while redirecting"), { status: StatusCode.INTERNAL_SERVER_ERROR, });
  }
}
