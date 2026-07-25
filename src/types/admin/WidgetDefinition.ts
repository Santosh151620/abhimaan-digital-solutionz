/**
 * ============================================================================
 * Dashboard Widget
 * ============================================================================
 */

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

export interface WidgetDefinition {

    id: string;

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

    createdAt: string;

}