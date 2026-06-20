import { createSupabaseServerClient } from "@/utils/auth/server";
import { User } from "@repo/shared";
import {type DBClient} from "@repo/db";

export type ContextType = {user: User | null; supabase: DBClient};

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
    supabase
  };
}
