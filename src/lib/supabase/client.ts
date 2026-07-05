import { createBrowserClient } from "@supabase/ssr";

import { env } from "../env";

let client:
  | ReturnType<typeof createBrowserClient>
  | undefined;

export function createClient() {
  if (typeof window === "undefined") {
    return createBrowserClient(
      env.supabase.url,
      env.supabase.anonKey
    );
  }

  if (!client) {
    client = createBrowserClient(
      env.supabase.url,
      env.supabase.anonKey
    );
  }

  return client;
}
