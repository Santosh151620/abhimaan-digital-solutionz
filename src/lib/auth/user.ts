import type { User } from "@supabase/supabase-js";

import { createServerClient } from "@/lib/supabase";

import { requireSession } from "./session";

export interface AuthUser {
  id: string;
  email: string;
  user: User;

  profile: {
    fullName: string | null;
  };

  organization: {
    id: string;
    role: string;
  };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const auth = await requireSession().catch(() => null);

  if (!auth) {
    return null;
  }

  const supabase = await createServerClient();

  const { data: membership, error } = await supabase
    .from("organization_members")
    .select(
      `
      role,
      organization_id,
      profiles (
        full_name
      )
    `
    )
    .eq("profile_id", auth.user.id)
    .eq("is_active", true)
    .single();

  if (error || !membership) {
    throw new Error("Organization membership not found.");
  }

    const profile =
    Array.isArray(membership.profiles)
      ? membership.profiles[0]
      : membership.profiles;

  return {
    id: auth.user.id,

    email: auth.user.email ?? "",

    user: auth.user,

    profile: {
      fullName: profile?.full_name ?? null,
    },

    organization: {
      id: membership.organization_id,
      role: membership.role,
    },
  };
}

export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}