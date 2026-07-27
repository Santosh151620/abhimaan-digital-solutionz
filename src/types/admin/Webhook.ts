/**
 * ============================================================================
 * Webhook
 * Enterprise Event Integration Contract
 * CRM + ERP Compatible
 * Production Contract
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


export type WebhookMethod =
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE";


export type WebhookStatus =
    | "Active"
    | "Inactive"
    | "Failed";


export interface Webhook extends BaseEntity {

    organizationId?: string;


    integrationId?: string;


    name: string;


    url: string;


    method: WebhookMethod;


    secretReference?: string;


    status: WebhookStatus;


    enabled: boolean;


    retryCount: number;


    timeoutSeconds: number;


    lastTriggeredAt?: string;


    metadata?: Record<string, unknown>;


    createdBy?: string;


    updatedBy?: string;

}
