/**
 * ============================================================================
 * Abhimaan Digital Solutionz
 *
 * Dashboard Widget Definition
 *
 * Enterprise Analytics / Dashboard Contract
 *
 * Compatible with:
 * - Admin
 * - CRM
 * - ERP
 * - Reporting
 * - AI
 *
 * Design:
 * - Platform widgets may have no organizationId.
 * - Organization widgets are tenant scoped.
 * - System widgets are immutable at tenant level.
 * - Runtime data is NOT stored in this contract.
 * - configuration contains declarative widget configuration only.
 * ============================================================================
 */

import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";



/**
 * ============================================================================
 * Widget Type
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



/**
 * ============================================================================
 * Widget Lifecycle
 * ============================================================================
 */

export type WidgetStatus =
    | "Active"
    | "Inactive"
    | "Deprecated";



/**
 * ============================================================================
 * Widget Definition
 * ============================================================================
 */

export interface WidgetDefinition
    extends BaseEntity {

    /**
     * Optional tenant ownership.
     *
     * Undefined:
     * Platform-level widget.
     *
     * Defined:
     * Organization-specific widget.
     */
    organizationId?: string;



    /**
     * Stable machine-readable widget identifier.
     *
     * Examples:
     * - crm.lead.pipeline
     * - crm.revenue.monthly
     * - admin.user.activity
     */
    code: string;



    /**
     * Human-readable widget name.
     */
    name: string;



    /**
     * Optional widget description.
     */
    description?: string;



    /**
     * Product modules supported by this widget.
     *
     * Examples:
     * - CRM
     * - Admin
     * - Reporting
     * - AI
     */
    moduleCodes: string[];



    /**
     * Rendering / interaction type.
     */
    type: WidgetType;



    /**
     * Lifecycle state.
     */
    status: WidgetStatus;



    /**
     * Logical datasource identifier.
     *
     * This should reference a known application datasource/provider.
     *
     * Do NOT store credentials or raw connection strings here.
     */
    datasource: string;



    /**
     * Declarative widget configuration.
     *
     * Examples:
     * - chart configuration
     * - column definitions
     * - metric formatting
     * - filters
     * - display configuration
     *
     * Runtime data must not be stored here.
     */
    configuration: Record<
        string,
        unknown
    >;



    /**
     * Automatic refresh interval in seconds.
     *
     * 0 means no automatic refresh.
     */
    refreshInterval: number;



    /**
     * Whether the widget supports realtime updates.
     */
    supportsRealtime: boolean;



    /**
     * Whether users may drill into the underlying entity/data.
     */
    supportsDrillDown: boolean;



    /**
     * Whether the widget supports data export.
     */
    supportsExport: boolean;



    /**
     * Runtime availability flag.
     *
     * This is intentionally separate from lifecycle status.
     */
    active: boolean;



    /**
     * Indicates a platform-controlled widget.
     *
     * System widgets must not be modified or deleted
     * by organization-level administrators.
     */
    isSystem: boolean;



    /**
     * Audit metadata.
     */
    createdBy?: string;

    updatedBy?: string;



    /**
     * Extension metadata.
     */
    metadata?: Record<
        string,
        unknown
    >;

}
