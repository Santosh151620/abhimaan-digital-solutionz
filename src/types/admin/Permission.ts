/**
 * ============================================================================
 * Permission
 * Enterprise Platform RBAC
 * CRM + ERP Compatible
 * Production Contract
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


export type PermissionScope =
    | "Global"
    | "Organization"
    | "Department"
    | "Module"
    | "Entity";


export type PermissionEffect =
    | "Allow"
    | "Deny";


export type PermissionType =
    | "System"
    | "Custom"
    | "Workflow"
    | "Data";


export interface Permission extends BaseEntity {

    /**
     * Organization ownership.
     * Optional for platform-level permissions.
     */
    organizationId?: string;


    /**
     * Business module ownership.
     * Example:
     * CRM, HRMS, Finance
     */
    module: string;


    /**
     * Resource controlled.
     * Example:
     * Lead, Invoice, User
     */
    resource: string;


    /**
     * Action allowed.
     * Example:
     * Create, Read, Update, Delete
     */
    action: string;


    /**
     * Unique permission identifier.
     */
    key: string;


    name: string;


    description?: string;


    type: PermissionType;


    scope: PermissionScope;


    effect: PermissionEffect;


    /**
     * Protect system permissions
     * from tenant modification.
     */
    isSystem: boolean;


    isActive: boolean;


    metadata?: Record<string, unknown>;


    /**
     * Audit ownership.
     */
    createdBy?: string;


    updatedBy?: string;


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
