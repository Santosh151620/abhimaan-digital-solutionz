import { TenantContext } from "@/lib/tenant";

/**
 * v6 ENTERPRISE API CLIENT
 * - Central request handler
 * - Tenant-aware
 * - Auth-ready
 * - Backend-agnostic (REST / Supabase / GraphQL ready)
 */

interface ApiRequestOptions extends RequestInit {
  tenant?: TenantContext;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { tenant, headers, ...rest } = options;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(tenant?.tenantId
        ? { "x-tenant-id": tenant.tenantId }
        : {}),
      ...headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "API Request Failed");
  }

  return res.json();
}