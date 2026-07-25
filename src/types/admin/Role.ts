/**
 * ============================================================================
 * Role
 * ============================================================================
 */

export type RoleType =
    | 'System'
    | 'Organization'
    | 'Custom';

export interface Role {

    id: string;

    organizationId?: string;

    name: string;

    code: string;

    description?: string;

    type: RoleType;

    permissionIds: string[];

    isSystem: boolean;

    isDefault: boolean;

    createdAt: string;

    updatedAt?: string;

}

export interface RoleAssignment {

    id: string;

    organizationId: string;

    userId: string;

    roleId: string;

    assignedBy?: string;

    assignedAt: string;

}