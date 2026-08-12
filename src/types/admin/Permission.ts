import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";







export type PermissionType =

    | "System"

    | "Custom";









/**
 * ============================================================================
 * ADS ENTERPRISE PLATFORM
 *
 * Permission Domain Contract
 *
 * RBAC Authorization Foundation
 *
 * ============================================================================
 */







export interface Permission

    extends BaseEntity {



    /**
     * Tenant scope
     */
    organizationId?:string;





    /**
     * Permission identity
     */
    key:string;





    name:string;





    description?:string;





    /**
     * Authorization grouping
     */
    module:string;





    action:string;





    type:PermissionType;





    /**
     * Governance
     */
    isSystem:boolean;





    isActive:boolean;





    /**
     * Extension
     */
    metadata?:Record<string,unknown>;



}







/**
 * ============================================================================
 * Permission Scope
 *
 * Where permission applies
 * ============================================================================
 */

export type PermissionScope =

    | "Platform"

    | "Organization"

    | "Department"

    | "Team";









/**
 * ============================================================================
 * Permission Effect
 *
 * Authorization decision
 * ============================================================================
 */

export type PermissionEffect =

    | "Allow"

    | "Deny";









/**
 * ============================================================================
 * Permission Group
 *
 * Permission classification container
 * ============================================================================
 */

export interface PermissionGroup {



    id:string;



    name:string;



    description?:string;



    module:string;



    organizationId?:string;



    isActive:boolean;



}









/**
 * ============================================================================
 * Role Permission Mapping
 *
 * Role â†” Permission relationship
 * ============================================================================
 */

export interface RolePermission {



    id:string;



    roleId:string;



    permissionId:string;



    organizationId?:string;



    scope?:PermissionScope;



    effect?:PermissionEffect;



    createdAt:string;



}









/**
 * ============================================================================
 * User Permission Mapping
 *
 * Direct user permissions
 * ============================================================================
 */

export interface UserPermission {



    id:string;



    userId:string;



    permissionId:string;



    organizationId?:string;



    scope?:PermissionScope;



    effect?:PermissionEffect;



    createdAt:string;



}




