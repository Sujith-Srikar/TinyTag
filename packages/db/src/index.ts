import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export * from "./queries/index";
export * from "./types";
export type DBClient = SupabaseClient<Database>;
