/**
 * ============================================================================
 * Role
 * Enterprise Platform RBAC
 * CRM + ERP Compatible
 * Production Contract
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


export type RoleType =
    | "System"
    | "Organization"
    | "Custom";


export type RoleLevel =
    | "Platform"
    | "Organization"
    | "Department"
    | "Module";


export type RoleStatus =
    | "Active"
    | "Inactive"
    | "Archived";


export interface Role extends BaseEntity {

    organizationId?: string;


    parentRoleId?: string;


    name: string;


    code: string;


    description?: string;


    type: RoleType;


    level: RoleLevel;


    status: RoleStatus;


    permissionIds: string[];


    moduleIds?: string[];


    isSystem: boolean;


    isDefault: boolean;


    isActive: boolean;


    metadata?: Record<string, unknown>;


    createdBy?: string;


    updatedBy?: string;


    deletedAt?: string;

}


export interface RoleAssignment extends BaseEntity {

    organizationId: string;


    userId: string;


    roleId: string;


    assignedBy?: string;


    assignedAt: string;


    expiresAt?: string;


    metadata?: Record<string, unknown>;

}


export interface RoleHierarchy {

    roleId: string;


    parentRoleId?: string;


    level: RoleLevel;

}
