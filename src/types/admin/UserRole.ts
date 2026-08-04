/**
 * ============================================================================
 * ADS Enterprise Platform
 * User Role Assignment
 * ============================================================================
 */

import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";



export interface UserRole
    extends BaseEntity {

    /**
     * Organization ownership
     */
    organization_id?: string;

    /**
     * Profile/User
     */
    user_id: string;

    /**
     * Assigned Role
     */
    role_id: string;

    /**
     * Primary Role
     */
    is_primary: boolean;

    /**
     * Audit
     */
    assigned_by?: string;

    created_at?: string;

    updated_at?: string;

}