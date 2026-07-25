/**
 * ============================================================================
 * Dashboard Definition
 * Enterprise Dashboard Contract
 * CRM + Admin Compatible
 * Production SaaS Contract
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


export type DashboardVisibility =
    | "Private"
    | "Organization"
    | "Public";


export type DashboardStatus =
    | "Draft"
    | "Active"
    | "Archived";


export interface DashboardDefinition extends BaseEntity {

    /**
     * Tenant ownership.
     * Undefined means platform dashboard.
     */
    organizationId?: string;


    /**
     * Dashboard identity.
     */
    name: string;


    description?: string;


    /**
     * Supported modules.
     */
    moduleCodes: string[];


    /**
     * Widget references.
     */
    widgets: string[];


    visibility: DashboardVisibility;


    status: DashboardStatus;


    /**
     * Default dashboard for users.
     */
    isDefault: boolean;


    /**
     * Auto refresh interval in seconds.
     */
    refreshInterval?: number;


    /**
     * Supports realtime updates.
     */
    supportsRealtime?: boolean;


    metadata?: Record<string, unknown>;


    createdBy?: string;


    updatedBy?: string;

}