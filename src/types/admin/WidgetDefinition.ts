/**
 * ============================================================================
 * Dashboard Widget
 * Enterprise Analytics Component Contract
 * CRM + Admin Compatible
 * Production SaaS Contract
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


export type WidgetType =
    | "Chart"
    | "Table"
    | "Metric"
    | "List"
    | "Timeline"
    | "Calendar"
    | "Kanban"
    | "Map"
    | "AI";


export type WidgetStatus =
    | "Active"
    | "Inactive"
    | "Deprecated";


export interface WidgetDefinition extends BaseEntity {

    /**
     * Tenant ownership.
     * Undefined means platform widget.
     */
    organizationId?: string;


    /**
     * Unique widget identifier.
     */
    code: string;


    name: string;


    description?: string;


    /**
     * Supported product modules.
     */
    moduleCodes: string[];


    type: WidgetType;


    status: WidgetStatus;


    /**
     * Data provider identifier.
     */
    datasource: string;


    /**
     * Widget UI configuration.
     */
    configuration: Record<string, unknown>;


    /**
     * Refresh interval in seconds.
     */
    refreshInterval: number;


    supportsRealtime: boolean;


    supportsDrillDown: boolean;


    supportsExport: boolean;


    active: boolean;


    metadata?: Record<string, unknown>;


    createdBy?: string;


    updatedBy?: string;

}