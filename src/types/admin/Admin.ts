/**
 * ============================================================================
 * Abhimaan Digital Solutionz
 * Admin Platform Contract
 * Enterprise Administration
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


export type AdminEntityType =
    | "organization"
    | "user"
    | "role"
    | "permission"
    | "module"
    | "setting"
    | "audit";


export interface AdminEntity extends BaseEntity {

    organizationId?: string;

    createdBy?: string;

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
