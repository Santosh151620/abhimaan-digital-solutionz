/**
 * ============================================================================
 * ADS ADMIN PLATFORM
 * Permission Contract
 *
 * Maps to:
 * admin_permissions
 *
 * Production RBAC Model
 * ============================================================================
 */

import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";



export type PermissionType =
    | "System"
    | "Custom";
export type PermissionScope =
    | "Global"
    | "Organization"
    | "Module"
    | "Entity";


export type PermissionEffect =
    | "Allow"
    | "Deny";


export interface Permission
extends BaseEntity {


    /**
     * Database:
     * permission_key
     */
    key:string;



    /**
     * Database:
     * module_name
     */
    module:string;



    /**
     * Database:
     * action_name
     */
    action:string;



    name:string;



    description?:string;



    type:PermissionType;



    isSystem:boolean;



    isActive:boolean;



    metadata?:Record<string,unknown>;



}



export interface PermissionGroup {


    module:string;


    permissions:Permission[];


}



export interface RolePermission {


    roleId:string;


    permissionId:string;


}



export interface UserPermission {


    userId:string;


    permissionId:string;


}