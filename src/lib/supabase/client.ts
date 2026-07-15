import { createBrowserClient } from "@supabase/ssr";

import { clientEnv } from "../env.client";

let client:
  | ReturnType<typeof createBrowserClient>
  | undefined;

export function createClient() {
  if (!client) {
    client = createBrowserClient(
      clientEnv.supabase.url,
      clientEnv.supabase.anonKey
    );
  }

  return client;
}




