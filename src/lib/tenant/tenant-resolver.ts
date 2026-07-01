import { NextRequest } from "next/server";

export interface ResolvedTenantContext {
  organizationId: string;
  userId?: string;
  userEmail?: string;
  role?: string;
  accessToken?: string;
}

/**
 * Central request resolver.
 *
 * Current:
 * - Organization resolved from request header
 * - User information resolved from request headers
 *
 * Future (no API changes):
 * - Supabase Auth
 * - JWT Claims
 * - NextAuth
 * - Clerk
 * - Organization Switcher
 */
export async function resolveTenantFromRequest(
  request: NextRequest
): Promise<ResolvedTenantContext> {
  const organizationId = request.headers.get("x-organization-id");

  if (!organizationId) {
    throw new Error("Missing organization context.");
  }

  return {
    organizationId,

    userId: request.headers.get("x-user-id") ?? undefined,

    userEmail: request.headers.get("x-user-email") ?? undefined,

    role: request.headers.get("x-user-role") ?? undefined,

    accessToken:
      request.headers
        .get("authorization")
        ?.replace(/^Bearer\s+/i, "") ?? undefined,
  };
}