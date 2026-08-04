export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MANAGER"
  | "USER";

export interface Permission {
  action: string;
  resource: string;
}

export interface UserSession {
  userId: string;
  tenantId: string;
  role: Role;
}

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [{ action: "*", resource: "*" }],

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

export function hasPermission(
  role: Role,
  action: string,
  resource: string
) {
  return ROLE_PERMISSIONS[role]?.some(
    p =>
      (p.action === "*" || p.action === action) &&
      (p.resource === "*" || p.resource === resource)
  ) ?? false;
}