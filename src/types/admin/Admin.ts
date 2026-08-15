/**
 * ============================================================================
 * Abhimaan Digital Solutionz
 * Admin Platform Contract
 * Enterprise Administration
 * ============================================================================
 *
 * Canonical type contract for Admin platform entities and dashboard data.
 *
 * This file intentionally contains contracts only.
 * Persistence, authorization, tenant isolation and business rules belong to
 * their respective repository/service layers.
 * ============================================================================
 */

import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";



/**
 * Entity categories addressable by the Admin platform.
 */
export type AdminEntityType =
    | "organization"
    | "user"
    | "role"
    | "permission"
    | "module"
    | "setting"
    | "audit";



/**
 * Common Admin entity contract.
 *
 * organizationId is optional because platform-level entities such as
 * organizations/modules may exist outside an organization scope.
 */
export interface AdminEntity
    extends BaseEntity {

    organizationId?: string;

    createdBy?: string;

    updatedBy?: string;

    isActive: boolean;

}



/**
 * Aggregated Admin platform metrics.
 */
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



/**
 * Admin dashboard snapshot.
 */
export interface AdminDashboard {

    summary: AdminSummary;

    generatedAt: string;

}