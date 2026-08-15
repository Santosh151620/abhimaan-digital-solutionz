/**
 * ============================================================================
 * Abhimaan Digital Solutionz
 *
 * Knowledge Source
 *
 * Enterprise AI Knowledge Management Contract
 * ============================================================================
 *
 * Contract-only definition.
 *
 * Knowledge ingestion, document retrieval, indexing, embedding generation,
 * scheduling, authorization and tenant isolation belong to the knowledge
 * service/repository/infrastructure layers.
 *
 * IMPORTANT:
 * `location` identifies the source. It must not contain embedded credentials,
 * access tokens or other secrets.
 * ============================================================================
 */

import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";



/**
 * Supported knowledge-source types.
 */
export type KnowledgeSourceType =
    | "Database"
    | "Document"
    | "Website"
    | "API"
    | "File"
    | "Manual";



/**
 * Knowledge-source ingestion/indexing lifecycle.
 */
export type KnowledgeSourceStatus =
    | "Pending"
    | "Indexing"
    | "Active"
    | "Failed"
    | "Disabled";



/**
 * Enterprise knowledge-source contract.
 */
export interface KnowledgeSource
    extends BaseEntity {


    /**
     * Optional tenant ownership.
     *
     * Undefined represents a platform-level knowledge source.
     */
    organizationId?: string;



    /**
     * Optional module association.
     *
     * Example:
     * CRM, Analytics, AI.
     */
    moduleCode?: string;



    /**
     * Human-readable source name.
     */
    name: string;



    /**
     * Source category.
     */
    type: KnowledgeSourceType;



    /**
     * Source location/reference.
     *
     * Examples:
     * URL, storage path, document reference, API endpoint.
     *
     * SECURITY:
     * Must never contain embedded credentials or secrets.
     */
    location: string;



    /**
     * Whether the source participates in automatic indexing.
     */
    indexingEnabled: boolean;



    /**
     * Whether embeddings should be generated for indexed content.
     */
    embeddingEnabled: boolean;



    /**
     * Optional refresh/indexing schedule.
     *
     * Scheduling syntax is interpreted by the ingestion layer.
     */
    refreshSchedule?: string;



    /**
     * Current ingestion/indexing status.
     */
    status?: KnowledgeSourceStatus;



    /**
     * Last successful indexing timestamp.
     */
    lastIndexedAt?: string;



    /**
     * Runtime enablement flag.
     */
    active: boolean;



    /**
     * Extensible non-sensitive metadata.
     */
    metadata?: Record<string, unknown>;



    /**
     * Audit ownership.
     */
    createdBy?: string;

    updatedBy?: string;

}