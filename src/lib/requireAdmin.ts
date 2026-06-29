import { createServerClient } from "@/lib/supabase";
import { requireAdmin as requireAdminGuard } from "@/lib/auth";

export async function requireAdmin() {
  const user = await requireAdminGuard();
  const supabase = await createServerClient();

  return {
    user: user.user,
    session: {
      user: user.user,
    },
    supabase,
  };
}