import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { TenantContextManager } from "@/lib/tenant/tenantContext";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  const tenant = TenantContextManager.require();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },

      global: {
        headers: {
          "x-organization-id": tenant.organizationId,
        },
      },
    }
  );
}
