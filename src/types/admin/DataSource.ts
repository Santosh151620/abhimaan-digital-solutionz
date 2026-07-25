/**
 * ============================================================================
 * External Data Source
 * Enterprise Integration Contract
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


export type DataSourceType =
    | "Database"
    | "REST API"
    | "SOAP"
    | "CSV"
    | "Excel"
    | "FTP"
    | "SFTP"
    | "Cloud Storage";


export type DataSourceStatus =
    | "Active"
    | "Inactive"
    | "Testing"
    | "Failed";


export interface DataSource extends BaseEntity {

    organizationId?: string;


    name: string;


    type: DataSourceType;


    connectionString?: string;


    authenticationType?: string;


    encryptedConfiguration?: string;


    status?: DataSourceStatus;


    active: boolean;


    metadata?: Record<string, unknown>;


    createdBy?: string;


    updatedBy?: string;

}