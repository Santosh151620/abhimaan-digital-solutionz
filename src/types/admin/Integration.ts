/**
 * ============================================================================
 * Integration
 * Enterprise Integration Contract
 * CRM + ERP Compatible
 * Production Contract
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

    organizationId?: string;


    name: string;


    code: string;


    type: IntegrationType;


    provider: string;


    status: IntegrationStatus;


    endpoint?: string;


    authenticationType?: IntegrationAuthType;


    enabled: boolean;


    /**
     * Reference only.
     * Never store secrets here.
     */
    credentialReference?: string;


    lastSyncAt?: string;


    metadata?: Record<string, unknown>;


    createdBy?: string;


    updatedBy?: string;

}