/**
 * ============================================================================
 * Report Template
 * ============================================================================
 */

export interface ReportTemplate {

    id: string;

    organizationId?: string;

    reportDefinitionId: string;

    name: string;

    description?: string;

    isSystem: boolean;

    isDefault: boolean;

    visibility: "Private" | "Organization";

    layout: Record<string, unknown>;

    createdBy: string;

    createdAt: string;

}