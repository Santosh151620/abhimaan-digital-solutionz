/**
 * ============================================================================
 * Role
 * Enterprise Platform RBAC
 * CRM + ERP Compatible
 * ============================================================================
 */

export type RoleType =
    | "System"
    | "Organization"
    | "Custom";

export type RoleLevel =
    | "Platform"
    | "Organization"
    | "Department"
    | "Module";

export interface Role {

    id: string;

    organizationId?: string;

    parentRoleId?: string;

    name: string;

    code: string;

    description?: string;

    type: RoleType;

    level: RoleLevel;

    permissionIds: string[];

    moduleIds?: string[];

    isSystem: boolean;

    isDefault: boolean;

    isActive: boolean;

    metadata?: Record<string, unknown>;

    createdBy?: string;

    updatedBy?: string;

    createdAt: string;

    updatedAt?: string;

    deletedAt?: string;

}

export interface RoleAssignment {

    id: string;

    organizationId: string;

    userId: string;

    roleId: string;

    assignedBy?: string;

    assignedAt: string;

    expiresAt?: string;

}

export interface RoleHierarchy {

    roleId: string;

    parentRoleId?: string;

    level: RoleLevel;

}