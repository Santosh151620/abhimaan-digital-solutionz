/**
 * ============================================================================
 * Admin User
 * ============================================================================
 */

export type UserStatus =
    | 'Active'
    | 'Inactive'
    | 'Suspended'
    | 'Pending';

export interface AdminUser {

    id: string;

    organizationId: string;

    profileId?: string;

    fullName: string;

    email: string;

    phone?: string;

    avatarUrl?: string;

    roleIds: string[];

    status: UserStatus;

    lastLoginAt?: string;

    createdAt: string;

    updatedAt?: string;

}

export interface UserSession {

    userId: string;

    organizationId: string;

    loggedInAt: string;

    expiresAt?: string;

}