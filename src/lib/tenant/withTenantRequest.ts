import { NextRequest } from "next/server";
import { TenantContextManager } from "./tenantContext";
import { resolveTenantFromRequest } from "./tenant-resolver";

export async function withTenantRequest<T>(
  request: NextRequest,
  handler: () => Promise<T>
): Promise<T> {
  const tenant = await resolveTenantFromRequest(request);

  return await new Promise<T>((resolve, reject) => {
    TenantContextManager.run(
      {
        organizationId: tenant.organizationId,
        userId: tenant.userId,
        userEmail: tenant.userEmail,
        role: tenant.role,
      },
      async () => {
        try {
          resolve(await handler());
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}




