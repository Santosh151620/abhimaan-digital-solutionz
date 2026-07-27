/**
 * ============================================================================
 * Saved View
 * Enterprise User Preference Contract
 * CRM + ERP Compatible
 * Production Contract
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


export type SavedViewVisibility =
    | "Private"
    | "Organization";


export interface SavedView extends BaseEntity {

    organizationId: string;


    moduleCode: string;


    entity: string;


    name: string;


    visibility: SavedViewVisibility;


    filters: Record<string, unknown>;


    sorting: Record<string, unknown>;


    columns: string[];


    isDefault: boolean;


    createdBy?: string;


    updatedBy?: string;


    metadata?: Record<string, unknown>;

}
