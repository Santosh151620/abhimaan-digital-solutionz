import { apiRequest } from "@/api/client";
import { TenantContext } from "@/lib/tenant";

/**
 * v7 BACKEND ADAPTER LAYER
 * - Single gateway for ALL backend communication
 * - Future: swap REST → Supabase/Prisma without touching CRM code
 */

export class BackendAdapter {
  static tenant: TenantContext | null = null;

  static setTenant(tenant: TenantContext) {
    this.tenant = tenant;
  }

  static async get<T>(url: string): Promise<T> {
    return apiRequest<T>(url, {
      method: "GET",
      tenant: this.tenant || undefined,
    });
  }

  static async post<T>(url: string, body: any): Promise<T> {
    return apiRequest<T>(url, {
      method: "POST",
      body: JSON.stringify(body),
      tenant: this.tenant || undefined,
    });
  }

  static async put<T>(url: string, body: any): Promise<T> {
    return apiRequest<T>(url, {
      method: "PUT",
      body: JSON.stringify(body),
      tenant: this.tenant || undefined,
    });
  }

  static async delete<T>(url: string): Promise<T> {
    return apiRequest<T>(url, {
      method: "DELETE",
      tenant: this.tenant || undefined,
    });
  }
}