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
 * ============================================================================
 */







export type RoleType =

    | "System"

    | "Organization"

    | "Custom";









export type RoleStatus =

    | "Active"

    | "Inactive";









export type RoleLevel =

    | "Platform"

    | "Application"

    | "Organization"

    | "Department"

    | "Team";









export interface Role

    extends BaseEntity {



    organizationId?:string;



    name:string;



    code:string;



    description?:string;



    type:RoleType;



    level:RoleLevel;



    status:RoleStatus;



    permissionIds:string[];



    isSystem:boolean;



    isDefault:boolean;



    isActive:boolean;



    metadata?:Record<string,unknown>;



}









/**
 * User ↔ Role assignment
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
 * Role hierarchy mapping
 */

export interface RoleHierarchy {



    id:string;



    parentRoleId:string;



    childRoleId:string;



    organizationId?:string;



    createdAt:string;



}