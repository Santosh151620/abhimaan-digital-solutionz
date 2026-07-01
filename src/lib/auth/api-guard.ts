import { NextRequest, NextResponse } from "next/server";
import {
  TenantContext,
  TenantContextManager,
} from "@/lib/tenant/tenantContext";
import { resolveTenantFromRequest } from "@/lib/tenant/tenant-resolver";

export interface TenantGuardOptions {
  /**
   * Require authenticated user.
   */
  requireUser?: boolean;

  /**
   * Allowed application roles.
   * Empty = any authenticated role.
   */
  allowedRoles?: readonly string[];
}

const DEFAULT_OPTIONS: Required<TenantGuardOptions> = {
  requireUser: true,
  allowedRoles: [],
};

export function withTenantGuard(
  handler: (
    request: NextRequest,
    context: Readonly<TenantContext>
  ) => Promise<NextResponse>,
  options: TenantGuardOptions = {}
) {
  const config = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const resolved = await resolveTenantFromRequest(request);

      const tenantContext: TenantContext = {
        organizationId: resolved.organizationId,
        userId: resolved.userId,
        userEmail: resolved.userEmail,
        role: resolved.role,
      };

      if (config.requireUser && !tenantContext.userId) {
        return NextResponse.json(
          {
            success: false,
            error: "Authentication required",
          },
          {
            status: 401,
          }
        );
      }

      if (
        config.allowedRoles.length > 0 &&
        tenantContext.role &&
        !config.allowedRoles.includes(tenantContext.role)
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Forbidden",
          },
          {
            status: 403,
          }
        );
      }

      return await TenantContextManager.run(
        tenantContext,
        async (): Promise<NextResponse> => {
          return handler(request, TenantContextManager.require());
        }
      );
    } catch (error) {
      console.error("[TenantGuard]", error);

      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }
  };
}