/**
 * ============================================================================
 * Abhimaan Digital Solutionz
 * Admin Platform
 * ============================================================================
 */

export type AdminEntityType =
    | 'organization'
    | 'user'
    | 'role'
    | 'permission'
    | 'module'
    | 'setting'
    | 'audit';

export interface AdminEntity {

    id: string;

    organizationId?: string;

    createdAt: string;

    createdBy?: string;

    updatedAt?: string;

    updatedBy?: string;

    isActive: boolean;

}

export interface AdminSummary {

    organizations: number;

    users: number;

    activeUsers: number;

    modules: number;

    enabledModules: number;

    roles: number;

    permissions: number;

    audits: number;

}

export interface AdminDashboard {

    summary: AdminSummary;

    generatedAt: string;

}