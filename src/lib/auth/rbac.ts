export type Role = "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "USER";

export interface Permission {
  action: string; // "read", "write", "delete", "update"
  resource: string; // "projects", "clients", "invoices"
}

export interface UserSession {
  userId: string;
  tenantId: string;
  role: Role;
}

/**
 * Role → Permissions mapping (CRM core access rules)
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    { action: "*", resource: "*" },
  ],

  ADMIN: [
    { action: "read", resource: "projects" },
    { action: "write", resource: "projects" },
    { action: "delete", resource: "projects" },

    { action: "read", resource: "clients" },
    { action: "write", resource: "clients" },

    { action: "read", resource: "invoices" },
    { action: "write", resource: "invoices" },
  ],

  MANAGER: [
    { action: "read", resource: "projects" },
    { action: "write", resource: "projects" },

    { action: "read", resource: "clients" },
  ],

  USER: [
    { action: "read", resource: "projects" },
  ],
};

/**
 * Permission check engine
 */
export function hasPermission(
  role: Role,
  action: string,
  resource: string
): boolean {
  const permissions = ROLE_PERMISSIONS[role];

  return permissions.some((p) => {
    const actionMatch = p.action === "*" || p.action === action;
    const resourceMatch = p.resource === "*" || p.resource === resource;
    return actionMatch && resourceMatch;
  });
}