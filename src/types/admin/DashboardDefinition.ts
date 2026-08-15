/**
 * ============================================================================
 * Abhimaan Digital Solutionz
 *
 * Dashboard Definition
 *
 * Enterprise Dashboard Contract
 * CRM + Admin Compatible
 * Production SaaS Contract
 * ============================================================================
 *
 * Contract-only definition.
 *
 * Dashboard persistence, authorization, tenant scoping, widget resolution and
 * runtime data loading belong to the service/repository/dashboard layers.
 * ============================================================================
 */

import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";



/**
 * Dashboard visibility scope.
 */
export type DashboardVisibility =
    | "Private"
    | "Organization"
    | "Public";



/**
 * Dashboard lifecycle status.
 */
export type DashboardStatus =
    | "Draft"
    | "Active"
    | "Archived";



/**
 * Enterprise dashboard definition.
 *
 * A dashboard may be:
 * - platform-level when organizationId is undefined,
 * - organization-scoped when organizationId is present.
 */
export interface DashboardDefinition
    extends BaseEntity {


    /**
     * Tenant ownership.
     *
     * Undefined represents a platform-level dashboard.
     */
    organizationId?: string;



    /**
     * Human-readable dashboard name.
     */
    name: string;



    /**
     * Optional dashboard description.
     */
    description?: string;



    /**
     * Application modules contributing data to this dashboard.
     *
     * Values should contain stable module codes rather than display names.
     */
    moduleCodes: string[];



    /**
     * Widget identifiers resolved by the dashboard runtime.
     */
    widgets: string[];



    /**
     * Visibility boundary.
     */
    visibility: DashboardVisibility;



    /**
     * Dashboard lifecycle status.
     */
    status: DashboardStatus;



    /**
     * Whether this dashboard is the default dashboard for its applicable
     * scope.
     */
    isDefault: boolean;



    /**
     * Automatic refresh interval in seconds.
     *
     * Undefined means no automatic refresh is configured.
     */
    refreshInterval?: number;



    /**
     * Whether the dashboard supports realtime updates.
     */
    supportsRealtime?: boolean;



    /**
     * Extensible non-sensitive dashboard metadata.
     */
    metadata?: Record<string, unknown>;



    /**
     * Audit ownership.
     */
    createdBy?: string;

    updatedBy?: string;

}