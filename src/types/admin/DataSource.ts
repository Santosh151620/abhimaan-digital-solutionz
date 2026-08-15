/**
 * ============================================================================
 * Abhimaan Digital Solutionz
 *
 * External Data Source
 *
 * Enterprise Integration Contract
 * ============================================================================
 *
 * Contract-only definition.
 *
 * IMPORTANT SECURITY RULE:
 * Connection strings, credentials, access tokens, private keys and other
 * secrets must never be exposed through normal API responses or client-side
 * contracts.
 *
 * Secret persistence and encryption belong to the infrastructure/secret
 * management layer.
 * ============================================================================
 */

import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";



/**
 * Supported external data-source families.
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



/**
 * Data-source operational status.
 */
export type DataSourceStatus =
    | "Active"
    | "Inactive"
    | "Testing"
    | "Failed";



/**
 * Enterprise external data-source contract.
 */
export interface DataSource
    extends BaseEntity {


    /**
     * Optional organization ownership.
     *
     * Undefined may represent a platform-level integration.
     */
    organizationId?: string;



    /**
     * Human-readable data-source name.
     */
    name: string;



    /**
     * External source type.
     */
    type: DataSourceType;



    /**
     * Optional connection string.
     *
     * SECURITY:
     * This may contain sensitive credentials. It must remain server-side and
     * must never be returned to untrusted clients.
     *
     * Prefer a secret reference for new integrations.
     */
    connectionString?: string;



    /**
     * Authentication mechanism used by the integration.
     *
     * Examples:
     * API Key, OAuth2, Basic, IAM, Service Account.
     */
    authenticationType?: string;



    /**
     * Encrypted provider-specific configuration.
     *
     * This field is intended for server-side persistence only.
     */
    encryptedConfiguration?: string;



    /**
     * Operational integration status.
     */
    status?: DataSourceStatus;



    /**
     * Runtime enablement flag.
     */
    active: boolean;



    /**
     * Extensible non-secret metadata.
     */
    metadata?: Record<string, unknown>;



    /**
     * Audit ownership.
     */
    createdBy?: string;

    updatedBy?: string;

}