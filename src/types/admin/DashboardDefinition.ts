/**
 * ============================================================================
 * Dashboard Definition
 * Enterprise Dashboard Contract
 * CRM + ERP Compatible
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


export type DashboardVisibility =
    | "Private"
    | "Organization"
    | "Public";


export interface DashboardDefinition extends BaseEntity {

    organizationId?: string;


    name: string;


    description?: string;


    moduleCodes: string[];


    widgets: string[];


    visibility: DashboardVisibility;


    isDefault: boolean;


    refreshInterval?: number;


    supportsRealtime?: boolean;


    createdBy: string;


    metadata?: Record<string, unknown>;

}