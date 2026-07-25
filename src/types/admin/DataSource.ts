/**
 * ============================================================================
 * External Data Source
 * ============================================================================
 */

export type DataSourceType =
    | "Database"
    | "REST API"
    | "SOAP"
    | "CSV"
    | "Excel"
    | "FTP"
    | "SFTP"
    | "Cloud Storage";

export interface DataSource {

    id: string;

    organizationId?: string;

    name: string;

    type: DataSourceType;

    connectionString?: string;

    authenticationType?: string;

    encryptedConfiguration?: string;

    active: boolean;

    createdAt: string;

    updatedAt?: string;

}