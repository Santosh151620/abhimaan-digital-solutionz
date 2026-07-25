/**
 * ============================================================================
 * Migration Template
 * ============================================================================
 */

export interface MigrationField {

    sourceField: string;

    destinationField: string;

    required: boolean;

    dataType: string;

    defaultValue?: string;

}

export interface MigrationTemplate {

    id: string;

    organizationId?: string;

    moduleCode: string;

    name: string;

    version: string;

    sourceSystem: string;

    destinationEntity: string;

    fields: MigrationField[];

    isSystem: boolean;

    createdAt: string;

}