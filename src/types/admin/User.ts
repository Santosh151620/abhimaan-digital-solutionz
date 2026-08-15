/**
 * ============================================================================
 * ADS ENTERPRISE PLATFORM
 *
 * Administrative User Contract
 *
 * Identity + Access Management
 *
 * Shared across:
 * - Admin
 * - CRM
 * - ERP
 * - Website
 *
 * Architecture:
 *
 * Supabase Auth
 *      ↓
 * Profile / User
 *      ↓
 * Organization Membership
 *      ↓
 * Admin User
 *      ↓
 * admin_user_roles
 *      ↓
 * Roles
 *      ↓
 * Permissions
 *
 * IMPORTANT:
 *
 * roleIds and primaryRoleId are resolved application fields.
 * They must NOT be persisted directly into the user/profile row unless
 * the database explicitly contains those columns.
 *
 * User preferences are runtime/application fields and should be persisted
 * through the existing settings infrastructure rather than a new
 * user_preferences table.
 * ============================================================================
 */

import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";


import type {
    ADSTheme,
} from "@/types/theme/Theme";



/**
 * ============================================================================
 * User Type
 * ============================================================================
 */
export type UserType =
    | "Internal"
    | "External"
    | "System"
    | "Service";



/**
 * ============================================================================
 * User Lifecycle Status
 * ============================================================================
 */
export type UserStatus =
    | "Pending"
    | "Active"
    | "Inactive"
    | "Suspended"
    | "Locked"
    | "Archived";



/**
 * ============================================================================
 * Theme Preference
 *
 * null means no explicit user preference.
 * The effective theme is resolved by ThemeService / ThemeProvider.
 * ============================================================================
 */
export type UserThemePreference =
    | ADSTheme
    | null;



/**
 * ============================================================================
 * Accessibility Preferences
 * ============================================================================
 */
export interface UserAccessibilityPreferences {

    reducedMotion?: boolean;

    highContrast?: boolean;

    compactMode?: boolean;

}



/**
 * ============================================================================
 * Notification Preferences
 * ============================================================================
 */
export interface UserNotificationPreferences {

    email?: boolean;

    inApp?: boolean;

    push?: boolean;

}



/**
 * ============================================================================
 * Administrative User
 *
 * Application-level identity/access contract.
 * ============================================================================
 */
export interface AdminUser
    extends BaseEntity {


    /**
     * =========================================================================
     * Tenant Ownership
     * =========================================================================
     */
    organizationId: string;



    /**
     * =========================================================================
     * Authentication Mapping
     *
     * profileId / authUserId identify the authentication/profile records.
     * =========================================================================
     */
    profileId?: string;

    authUserId?: string;



    /**
     * =========================================================================
     * Identity
     * =========================================================================
     */
    fullName: string;

    firstName?: string;

    lastName?: string;

    displayName?: string;

    email: string;

    phone?: string;

    avatarUrl?: string;



    /**
     * =========================================================================
     * Organization / Employment Information
     * =========================================================================
     */
    jobTitle?: string;

    department?: string;

    employeeCode?: string;



    /**
     * =========================================================================
     * User Classification
     * =========================================================================
     */
    userType: UserType;

    status: UserStatus;

    isActive: boolean;



    /**
     * =========================================================================
     * Authorization
     *
     * These are resolved relationship fields.
     *
     * Persistence:
     *
     * AdminUser
     *     ↓
     * admin_user_roles
     *     ↓
     * admin_roles
     *
     * Do NOT write these fields directly into the user/profile table.
     * =========================================================================
     */
    roleIds: string[];

    primaryRoleId?: string;



    /**
     * =========================================================================
     * Verification
     * =========================================================================
     */
    emailVerified?: boolean;

    phoneVerified?: boolean;



    /**
     * =========================================================================
     * Activity / Security
     * =========================================================================
     */
    lastLoginAt?: string;

    lastActivityAt?: string;

    passwordChangedAt?: string;

    failedLoginAttempts?: number;

    lockedUntil?: string;



    /**
     * =========================================================================
     * Localization
     *
     * User-level localization values are application preferences.
     * =========================================================================
     */
    locale?: string;

    timezone?: string;



    /**
     * =========================================================================
     * Appearance
     *
     * Runtime preference.
     *
     * Persistence should use the existing settings infrastructure.
     * =========================================================================
     */
    themePreference?: UserThemePreference;



    /**
     * =========================================================================
     * Accessibility
     * =========================================================================
     */
    accessibility?: UserAccessibilityPreferences;



    /**
     * =========================================================================
     * Notifications
     * =========================================================================
     */
    notificationPreferences?: UserNotificationPreferences;



    /**
     * =========================================================================
     * Audit
     * =========================================================================
     */
    createdBy?: string;

    updatedBy?: string;



    /**
     * =========================================================================
     * Extension Metadata
     * =========================================================================
     */
    metadata?: Record<string, unknown>;

}



/**
 * ============================================================================
 * User Session
 *
 * Runtime authentication/authorization context.
 *
 * This is NOT a database entity.
 * ============================================================================
 */
export interface UserSession {

    id: string;

    userId: string;

    organizationId: string;

    email: string;

    roles: string[];

    permissions: string[];

    expiresAt?: string;

}



/**
 * ============================================================================
 * User Role Assignment
 *
 * Explicit relationship between a user and role.
 *
 * Persistence should map to:
 *
 * admin_user_roles
 *
 * This contract intentionally remains separate from AdminUser.
 * ============================================================================
 */
export interface UserRoleAssignment {

    id: string;

    userId: string;

    roleId: string;

    organizationId?: string;

    assignedBy?: string;

    assignedAt: string;

    expiresAt?: string;

    isActive: boolean;

}
