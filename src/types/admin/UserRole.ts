import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";







/**
 * ============================================================================
 * ADS ENTERPRISE PLATFORM
 *
 * User Role Assignment Contract
 *
 * Organization Scoped
 * RBAC Ready
 * Audit Ready
 *
 * Mirrors:
 * admin.user_roles
 *
 * ============================================================================
 */







export interface UserRole

    extends BaseEntity {



    /**
     * Tenant ownership
     */
    organizationId:string;





    /**
     * Identity mapping
     */
    userId:string;





    /**
     * Assigned role
     */
    roleId:string;





    /**
     * Primary role
     *
     * User may have multiple roles,
     * but one primary role.
     */
    isPrimary:boolean;





    /**
     * Assignment state
     */
    isActive:boolean;





    /**
     * Audit
     */
    assignedBy?:string;





    assignedAt:string;







    /**
     * Extension
     */
    metadata?:Record<string, unknown>;



}