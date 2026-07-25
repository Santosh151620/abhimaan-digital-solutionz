/**
 * ============================================================================
 * Webhook
 * ============================================================================
 */

export type WebhookMethod =
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE";

export interface Webhook {

    id: string;

    organizationId?: string;

    integrationId?: string;

    name: string;

    url: string;

    method: WebhookMethod;

    secret?: string;

    enabled: boolean;

    retryCount: number;

    timeoutSeconds: number;

    createdAt: string;

    updatedAt?: string;

}