import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/auth/server";
import { logger } from "@repo/shared";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    logger.error("Auth callback failed", error);

    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.redirect(new URL("/dashboard", req.url));
}
