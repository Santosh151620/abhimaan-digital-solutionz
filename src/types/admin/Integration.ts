/**
 * ============================================================================
 * Integration
 * Enterprise Integration Contract
 * CRM + Admin Compatible
 * Production SaaS Contract
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


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
    | "Disabled"
    | "Error";


export type IntegrationAuthType =
    | "None"
    | "APIKey"
    | "OAuth"
    | "Basic"
    | "Certificate";


export interface Integration extends BaseEntity {

    /**
     * Tenant ownership.
     * Optional for platform integrations.
     */
    organizationId?: string;


    /**
     * Integration identity.
     */
    name: string;


    code: string;


    /**
     * Connection category.
     */
    type: IntegrationType;


    /**
     * External provider name.
     * Example:
     * Supabase, Stripe, OpenAI
     */
    provider: string;


    status: IntegrationStatus;


    /**
     * External endpoint.
     */
    endpoint?: string;


    /**
     * Authentication mechanism.
     */
    authenticationType?: IntegrationAuthType;


    /**
     * Integration enabled state.
     */
    enabled: boolean;


    /**
     * Reference to secret storage.
     * Never store credentials here.
     */
    credentialReference?: string;


    /**
     * Synchronization tracking.
     */
    lastSyncAt?: string;


    metadata?: Record<string, unknown>;


    createdBy?: string;


    updatedBy?: string;

}