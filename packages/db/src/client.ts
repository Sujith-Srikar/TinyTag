import { createClient } from "@supabase/supabase-js";
import { Database } from "./types.js";
import { clientEnv } from "@repo/shared/env/client";

export const db = createClient<Database>(
  clientEnv.NEXT_PUBLIC_SUPABASE_URL,
  clientEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);
