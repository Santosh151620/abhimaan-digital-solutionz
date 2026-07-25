/**
 * ============================================================================
 * Knowledge Source
 * ============================================================================
 */

export type KnowledgeSourceType =
    | "Database"
    | "Document"
    | "Website"
    | "API"
    | "File"
    | "Manual";

export interface KnowledgeSource {

    id: string;

    organizationId?: string;

    moduleCode?: string;

    name: string;

    type: KnowledgeSourceType;

    location: string;

    indexingEnabled: boolean;

    embeddingEnabled: boolean;

    refreshSchedule?: string;

    active: boolean;

    createdAt: string;

    updatedAt?: string;

}