/**
 * ============================================================================
 * Migration Template
 * Enterprise Data Migration Contract
 * CRM + ERP Compatible
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


export interface MigrationField {

    sourceField: string;


    destinationField: string;


    required: boolean;


    dataType: string;


    defaultValue?: string;


    transformationRule?: string;

}


export interface MigrationTemplate extends BaseEntity {

    organizationId?: string;


    moduleCode: string;


    name: string;


    version: string;


    sourceSystem: string;


    destinationEntity: string;


    fields: MigrationField[];


    isSystem: boolean;


    metadata?: Record<string, unknown>;


    createdBy?: string;


    updatedBy?: string;

}
