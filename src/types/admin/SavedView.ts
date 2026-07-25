/**
 * ============================================================================
 * Saved View
 * ============================================================================
 */

export interface SavedView {

    id: string;

    organizationId: string;

    moduleCode: string;

    entity: string;

    name: string;

    visibility: "Private" | "Organization";

    filters: Record<string, unknown>;

    sorting: Record<string, unknown>;

    columns: string[];

    isDefault: boolean;

    createdBy: string;

    createdAt: string;

}