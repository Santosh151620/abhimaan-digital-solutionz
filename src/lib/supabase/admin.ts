import { createClient } from "@supabase/supabase-js";

import { env } from "../env";

export const supabaseAdmin = createClient(
  env.supabase.url,
  env.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);





