/**
 * ============================================================================
 * Dashboard Definition
 * ============================================================================
 */

export interface DashboardDefinition {

    id: string;

    organizationId?: string;

    name: string;

    description?: string;

    moduleCodes: string[];

    widgets: string[];

    visibility: "Private" | "Organization";

    isDefault: boolean;

    createdBy: string;

    createdAt: string;

    updatedAt?: string;

}