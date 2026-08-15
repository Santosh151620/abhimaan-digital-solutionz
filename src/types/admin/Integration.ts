/**
 * ============================================================================
 * Abhimaan Digital Solutionz
 *
 * Integration
 *
 * Enterprise Integration Contract
 * CRM + Admin Compatible
 * Production SaaS Contract
 * ============================================================================
 *
 * Contract-only definition.
 *
 * Integration credentials must never be stored directly in this contract.
 * credentialReference must point to an approved server-side secret/credential
 * store.
 *
 * Connection management, authentication, synchronization, retry handling,
 * authorization and tenant isolation belong to the integration service and
 * infrastructure layers.
 * ============================================================================
 */

import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";



/**
 * Integration transport/category.
 */
export type IntegrationType =
    | "REST"
    | "SOAP"
    | "Database"
    | "Webhook"
    | "File"
    | "Email"
    | "Queue";



/**
 * Integration lifecycle/connection status.
 */
export type IntegrationStatus =
    | "Connected"
    | "Disconnected"
    | "Pending"
    | "Disabled"
    | "Error";



/**
 * Supported authentication mechanisms.
 */
export type IntegrationAuthType =
    | "None"
    | "APIKey"
    | "OAuth"
    | "Basic"
    | "Certificate";



/**
 * Enterprise integration contract.
 */
export interface Integration
    extends BaseEntity {


    /**
     * Tenant ownership.
     *
     * Undefined represents a platform-level integration.
     */
    organizationId?: string;



    /**
     * Human-readable integration name.
     */
    name: string;



    /**
     * Stable machine-readable integration code.
     */
    code: string;



    /**
     * Integration transport/category.
     */
    type: IntegrationType;



    /**
     * External provider/service name.
     *
     * Examples:
     * Supabase, Stripe, OpenAI.
     */
    provider: string;



    /**
     * Current integration connection/lifecycle state.
     */
    status: IntegrationStatus;



    /**
     * External service endpoint.
     *
     * Sensitive endpoints should not be exposed to unauthorized clients.
     */
    endpoint?: string;



    /**
     * Authentication mechanism used by the integration.
     */
    authenticationType?: IntegrationAuthType;



    /**
     * Whether the integration is enabled for execution.
     */
    enabled: boolean;



    /**
     * Reference to server-side credential/secret storage.
     *
     * IMPORTANT:
     * This is a reference only. Never store API keys, passwords, tokens,
     * private keys or certificates directly in this field.
     */
    credentialReference?: string;



    /**
     * Last successful synchronization timestamp.
     */
    lastSyncAt?: string;



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