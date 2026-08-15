/**
 * ============================================================================
 * Abhimaan Digital Solutionz
 *
 * Migration Template
 *
 * Enterprise Data Migration Contract
 * CRM + ERP Compatible
 * Production SaaS Contract
 * ============================================================================
 *
 * Defines a reusable mapping between an external/source system and an ADS
 * destination entity.
 *
 * IMPORTANT:
 * This contract defines migration metadata and field mappings only.
 * Actual migration execution, validation, transactions, authorization and
 * tenant isolation belong to the migration service/repository layers.
 * ============================================================================
 */

import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";



/**
 * Individual source → destination field mapping.
 */
export interface MigrationField {


    /**
     * Field name in the source system.
     */
    sourceField: string;



    /**
     * Field name in the ADS destination entity.
     */
    destinationField: string;



    /**
     * Whether the destination field is required for migration.
     */
    required: boolean;



    /**
     * Expected destination/source data type.
     *
     * Examples:
     * string, number, boolean, date, datetime, uuid.
     */
    dataType: string;



    /**
     * Optional fallback value when the source does not provide a value.
     */
    defaultValue?: string;



    /**
     * Optional transformation expression/rule.
     *
     * Execution must be performed by a trusted migration engine.
     * Never evaluate arbitrary expressions directly.
     */
    transformationRule?: string;

}



/**
 * Reusable enterprise migration mapping template.
 */
export interface MigrationTemplate
    extends BaseEntity {


    /**
     * Optional organization ownership.
     *
     * Undefined may represent a platform/system template.
     */
    organizationId?: string;



    /**
     * ADS module receiving the migrated data.
     *
     * Examples:
     * CRM, ERP, Contacts, Leads.
     */
    moduleCode: string;



    /**
     * Human-readable template name.
     */
    name: string;



    /**
     * Template version.
     *
     * Version changes should create a traceable migration definition.
     */
    version: string;



    /**
     * Source application/system.
     *
     * Examples:
     * Salesforce, HubSpot, Excel, legacy CRM.
     */
    sourceSystem: string;



    /**
     * ADS destination entity.
     *
     * Examples:
     * companies, contacts, leads.
     */
    destinationEntity: string;



    /**
     * Source → destination mappings.
     */
    fields: MigrationField[];



    /**
     * Indicates a platform-provided/system template.
     *
     * System templates should not be deleted or modified by normal
     * organization administrators.
     */
    isSystem: boolean;



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