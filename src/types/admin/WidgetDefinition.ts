/**
 * ============================================================================
 * Dashboard Widget
 * Enterprise Analytics Component Contract
 * CRM + ERP Compatible
 * Production Contract
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


export interface WidgetDefinition extends BaseEntity {

    organizationId?: string;


    code: string;


    name: string;


    moduleCodes: string[];


    type: WidgetType;


    datasource: string;


    configuration: Record<string, unknown>;


    refreshInterval: number;


    supportsRealtime: boolean;


    supportsDrillDown: boolean;


    supportsExport: boolean;


    active: boolean;


    createdBy?: string;


    updatedBy?: string;


    metadata?: Record<string, unknown>;

}