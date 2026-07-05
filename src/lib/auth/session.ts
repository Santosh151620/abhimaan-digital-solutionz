import { createServerClient } from "@/lib/supabase";

import type { Session, User } from "@supabase/supabase-js";

export interface AuthSession {
  session: Session;
  user: User;
}

export async function getSession(): Promise<AuthSession | null> {
  const supabase = await createServerClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  if (!session) {
    return null;
  }

  return {
    session,
    user: session.user,
  };
}

export async function requireSession(): Promise<AuthSession> {
  const auth = await getSession();

  if (!auth) {
    throw new Error("Unauthorized");
  }

  return auth;
}

export async function getSupabase() {
  return createServerClient();
}
