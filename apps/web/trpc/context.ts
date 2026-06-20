import { createSupabaseServerClient } from "@/utils/auth/server";
import { User } from "@repo/shared";

export type ContextType = {
  user: User | null;
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
};

export async function createTRPCContext(): Promise<ContextType> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return {
    user: user
      ? {
          id: user.id,
          isAnonymous: user.is_anonymous ?? false,
          email: user.email ?? null,
        }
      : null,
    supabase,
  };
}
