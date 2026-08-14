import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";

import type {
    ADSTheme,
} from "@/types/theme/Theme";





export type UserType =

    | "Internal"

    | "External"

    | "System"

    | "Service";






export type UserStatus =

    | "Pending"

    | "Active"

    | "Inactive"

    | "Suspended"

    | "Locked"

    | "Archived";






export type UserThemePreference =

    | ADSTheme

    | null;






export interface UserAccessibilityPreferences {


    reducedMotion?: boolean;


    highContrast?: boolean;


    compactMode?: boolean;


}






export interface UserNotificationPreferences {


    email?: boolean;


    inApp?: boolean;


    push?: boolean;


}








/**
 * ============================================================================
 * ADS ENTERPRISE PLATFORM
 *
 * Administrative User Contract
 *
 * Identity + Access Management
 *
 * Shared across:
 * Website
 * CRM
 * ERP
 * Admin
 *
 * ============================================================================
 */


export interface AdminUser

    extends BaseEntity {



    /**
     * Tenant
     */
    organizationId:string;





    /**
     * Authentication mapping
     */
    profileId?:string;


    authUserId?:string;





    /**
     * Identity
     */
    fullName:string;


    firstName?:string;


    lastName?:string;


    displayName?:string;


    email:string;


    phone?:string;


    avatarUrl?:string;





    /**
     * Organization information
     */
    jobTitle?:string;
    department?:string;
    employeeCode?:string;
    userType:UserType;
    status:UserStatus;
    isActive:boolean;
    roleIds:string[];
    primaryRoleId?:string;
    emailVerified?:boolean;
    phoneVerified?:boolean;
    lastLoginAt?:string;
    lastActivityAt?:string;
    passwordChangedAt?:string;
    failedLoginAttempts?:number;
    lockedUntil?:string;
    locale?:string;
    timezone?:string;
    themePreference?:UserThemePreference;
    accessibility?:UserAccessibilityPreferences;
    notificationPreferences?:UserNotificationPreferences;
    createdBy?:string;
    updatedBy?:string;
    metadata?:Record<string, unknown>;
}

export interface UserSession {
    id:string;
    userId:string;
    organizationId:string;
    email:string;
    roles:string[];
    permissions:string[];
    expiresAt?:string;
}

export interface UserRoleAssignment {
    id:string;
    userId:string;
    roleId:string;
    organizationId?:string;
    assignedBy?:string;
    assignedAt:string;
    expiresAt?:string;
    isActive:boolean;
}
