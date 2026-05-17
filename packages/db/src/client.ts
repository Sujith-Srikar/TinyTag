import { createClient } from '@supabase/supabase-js';
import {Database} from './types.js';
import {env} from '@repo/shared';

export const db = createClient<Database>(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);
