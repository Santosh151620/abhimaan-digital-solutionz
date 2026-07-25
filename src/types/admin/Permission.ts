/**
 * ============================================================================
 * Permission
 * Enterprise Platform RBAC
 * CRM + ERP Compatible
 * ============================================================================
 */

export type PermissionScope =
    | "Global"
    | "Organization"
    | "Department"
    | "Module"
    | "Entity";

export type PermissionEffect =
    | "Allow"
    | "Deny";

export interface Permission {

    id: string;

    organizationId?: string;

    module: string;

    resource: string;

    action: string;

    key: string;

    name: string;

    description?: string;

    scope: PermissionScope;

    effect: PermissionEffect;

    isSystem: boolean;

    isActive: boolean;

    metadata?: Record<string, unknown>;

    createdBy?: string;

    updatedBy?: string;

    createdAt: string;

    updatedAt?: string;

    deletedAt?: string;

}

export interface PermissionGroup {

    module: string;

    permissions: Permission[];

}

export interface RolePermission {

    roleId: string;

    permissionId: string;

}

export interface UserPermission {

    userId: string;

    permissionId: string;

}