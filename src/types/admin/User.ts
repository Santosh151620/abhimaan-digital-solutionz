/**
 * ============================================================================
 * ADS ENTERPRISE PLATFORM
 * Admin User Contract
 *
 * Enterprise Identity
 * Organization Aware
 * RBAC Ready
 * Audit Ready
 * Security Ready
 * CRM / Admin Shared
 * ============================================================================
 */

import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";



export type UserStatus =
    | "Active"
    | "Inactive"
    | "Pending"
    | "Suspended"
    | "Locked"
    | "Archived";



export type UserType =
    | "Internal"
    | "External"
    | "System"
    | "Service";



export interface AdminUser
    extends BaseEntity {

    /**
     * Tenant ownership.
     */
    organizationId: string;

    /**
     * Authentication profile.
     * Usually Supabase profile id.
     */
    profileId?: string;

    authUserId?: string;

    /**
     * Identity
     */
    fullName: string;

    firstName?: string;

    lastName?: string;

    displayName?: string;

    email: string;

    phone?: string;

    avatarUrl?: string;

    jobTitle?: string;

    department?: string;

    employeeCode?: string;

    /**
     * Classification
     */
    userType: UserType;

    status: UserStatus;

    /**
     * RBAC
     *
     * Convenience cache.
     * Actual assignments are maintained
     * through admin.user_roles.
     */
    roleIds: string[];

    primaryRoleId?: string;

    /**
     * Lifecycle
     */
    isActive: boolean;

    emailVerified?: boolean;

    phoneVerified?: boolean;

    lastLoginAt?: string;

    lastActivityAt?: string;

    passwordChangedAt?: string;

    failedLoginAttempts?: number;

    lockedUntil?: string;

    /**
     * Preferences
     */
    locale?: string;

    timezone?: string;

    /**
     * Audit
     */
    createdBy?: string;

    updatedBy?: string;

    /**
     * Extension point
     */
    metadata?: Record<string, unknown>;
}



/**
 * ============================================================================
 * Active Session
 * ============================================================================
 */

export interface UserSession {

    userId: string;

    organizationId: string;

    sessionId?: string;

    loggedInAt: string;

    expiresAt?: string;

    lastActivityAt?: string;

    ipAddress?: string;

    userAgent?: string;

    metadata?: Record<string, unknown>;
}



/**
 * ============================================================================
 * User ⇄ Role Assignment
 *
 * Mirrors admin.user_roles
 * ============================================================================
 */

export interface UserRoleAssignment
    extends BaseEntity {

    organizationId: string;

    userId: string;

    roleId: string;

    assignedBy?: string;

    assignedAt: string;

    expiresAt?: string;

    isActive: boolean;

    metadata?: Record<string, unknown>;
}