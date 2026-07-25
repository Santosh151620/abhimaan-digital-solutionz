/**
 * ============================================================================
 * Integration
 * ============================================================================
 */

export type IntegrationType =
    | "REST"
    | "SOAP"
    | "Database"
    | "Webhook"
    | "File"
    | "Email"
    | "Queue";

export type IntegrationStatus =
    | "Connected"
    | "Disconnected"
    | "Pending"
    | "Disabled";

export interface Integration {

    id: string;

    organizationId?: string;

    name: string;

    code: string;

    type: IntegrationType;

    provider: string;

    status: IntegrationStatus;

    endpoint?: string;

    authenticationType?: string;

    enabled: boolean;

    metadata?: Record<string, unknown>;

    createdAt: string;

    updatedAt?: string;

}