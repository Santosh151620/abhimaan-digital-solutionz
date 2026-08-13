import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";


/**
 * ============================================================================
 * ADS ENTERPRISE PLATFORM
 *
 * Role Domain Contract
 *
 * RBAC Foundation
 *
 * Shared across:
 * Platform
 * Admin
 * CRM
 * Website
 * ERP
 *
 * ============================================================================
 */


export type RoleType =

    | "System"

    | "Organization"

    | "Custom";


export type RoleStatus =

    | "Active"

    | "Inactive"

    | "Suspended"

    | "Archived";


export type RoleLevel =

    | "Platform"

    | "Application"

    | "Organization"

    | "Department"

    | "Team";



/**
 * ============================================================================
 * ROLE
 * ============================================================================
 *
 * Represents an RBAC role.
 *
 * System roles are platform-defined and protected from organization-level
 * modification/deletion.
 *
 * Organization roles belong to an organization and may be customized
 * according to the organization's access model.
 *
 * ============================================================================
 */

export interface Role
    extends BaseEntity {

    /**
     * Organization ownership.
     *
     * Undefined for platform/system roles where applicable.
     */
    organizationId?:string;


    /**
     * Role identity.
     */
    name:string;

    code:string;

    description?:string;


    /**
     * RBAC classification.
     */
    type:RoleType;

    level:RoleLevel;

    status:RoleStatus;


    /**
     * Permissions assigned to this role.
     *
     * Permission relationships may also be represented by the
     * role_permissions persistence layer.
     */
    permissionIds?:string[];


    /**
     * Lifecycle and protection flags.
     */
    isSystem:boolean;

    isDefault:boolean;

    isActive:boolean;


    /**
     * Extensible role metadata.
     */
    metadata?:Record<string,unknown>;

}



/**
 * ============================================================================
 * ROLE ASSIGNMENT
 * ============================================================================
 *
 * Represents assignment of a role to a user.
 *
 * ============================================================================
 */

export interface RoleAssignment {

    id:string;

    organizationId?:string;

    userId:string;

    roleId:string;

    assignedBy?:string;

    assignedAt:string;

    expiresAt?:string;

    isActive:boolean;

}



/**
 * ============================================================================
 * ROLE HIERARCHY
 * ============================================================================
 *
 * Represents parent/child relationships between roles.
 *
 * ============================================================================
 */

export interface RoleHierarchy {

    id:string;

    parentRoleId:string;

    childRoleId:string;

    organizationId?:string;

    createdAt:string;

}