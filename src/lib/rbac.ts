/**
 * v5 RBAC ENGINE (CLIENT + BACKEND READY)
 */

export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MANAGER"
  | "MEMBER"
  | "VIEWER";

export type Permission =
  | "view_projects"
  | "edit_projects"
  | "delete_projects"
  | "manage_users"
  | "manage_billing";

const ROLE_MATRIX: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    "view_projects",
    "edit_projects",
    "delete_projects",
    "manage_users",
    "manage_billing",
  ],
  ADMIN: [
    "view_projects",
    "edit_projects",
    "manage_users",
    "manage_billing",
  ],
  MANAGER: ["view_projects", "edit_projects"],
  MEMBER: ["view_projects"],
  VIEWER: ["view_projects"],
};

export function hasPermission(
  role: Role,
  permission: Permission
): boolean {
  return ROLE_MATRIX[role]?.includes(permission);
}