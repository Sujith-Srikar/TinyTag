import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/auth/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error(error);

    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.redirect(new URL("/dashboard", req.url));
}
