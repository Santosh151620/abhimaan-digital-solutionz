/**
 * ============================================================================
 * Knowledge Source
 * Enterprise AI Knowledge Management Contract
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


export type KnowledgeSourceType =
    | "Database"
    | "Document"
    | "Website"
    | "API"
    | "File"
    | "Manual";


export type KnowledgeSourceStatus =
    | "Pending"
    | "Indexing"
    | "Active"
    | "Failed"
    | "Disabled";


export interface KnowledgeSource extends BaseEntity {

    organizationId?: string;


    moduleCode?: string;


    name: string;


    type: KnowledgeSourceType;


    location: string;


    indexingEnabled: boolean;


    embeddingEnabled: boolean;


    refreshSchedule?: string;


    status?: KnowledgeSourceStatus;


    lastIndexedAt?: string;


    active: boolean;


    metadata?: Record<string, unknown>;


    createdBy?: string;


    updatedBy?: string;

}