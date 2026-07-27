/**
 * ============================================================================
 * Admin User
 * Enterprise Identity Contract
 * CRM + Admin Compatible
 * Production Contract
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


export type UserStatus =
    | "Active"
    | "Inactive"
    | "Suspended"
    | "Pending";


export type UserType =
    | "Internal"
    | "External"
    | "System";


export interface AdminUser extends BaseEntity {

    /**
     * Tenant ownership.
     */
    organizationId: string;


    /**
     * Link to public profile entity.
     */
    profileId?: string;


    fullName: string;


    email: string;


    phone?: string;


    avatarUrl?: string;


    userType: UserType;


    roleIds: string[];


    status: UserStatus;


    lastLoginAt?: string;


    metadata?: Record<string, unknown>;


    createdBy?: string;


    updatedBy?: string;


}


export interface UserSession {

    userId: string;


    organizationId: string;


    loggedInAt: string;


    expiresAt?: string;


    ipAddress?: string;


    userAgent?: string;

}
