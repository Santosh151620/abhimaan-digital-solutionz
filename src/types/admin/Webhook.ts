/**
 * ============================================================================
 * ADS ENTERPRISE PLATFORM
 *
 * Webhook Contract
 *
 * Enterprise Event Integration
 * CRM + ERP Compatible
 * Multi-Tenant
 * Production SaaS Contract
 *
 * Architecture:
 *
 * Integration
 *      ↓
 * Webhook
 *      ↓
 * Event Delivery
 *
 * Security:
 * - Never persist raw webhook secrets in this contract.
 * - secretReference points to secure secret storage.
 * - Tenant isolation remains enforced by repository/RLS.
 * ============================================================================
 */

import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";



/**
 * ============================================================================
 * Webhook HTTP Method
 * ============================================================================
 */
export type WebhookMethod =
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE";



/**
 * ============================================================================
 * Webhook Lifecycle Status
 * ============================================================================
 */
export type WebhookStatus =
    | "Active"
    | "Inactive"
    | "Failed";



/**
 * ============================================================================
 * Webhook
 *
 * Represents an outbound HTTP endpoint used for event/integration delivery.
 *
 * This is intentionally separate from Integration:
 *
 * Integration = external system/provider connection
 * Webhook    = specific event delivery endpoint
 * ============================================================================
 */
export interface Webhook
    extends BaseEntity {


    /**
     * =========================================================================
     * Tenant Ownership
     *
     * Undefined may represent a platform-level webhook.
     * Repository/RLS must enforce the actual ownership boundary.
     * =========================================================================
     */
    organizationId?: string;



    /**
     * =========================================================================
     * Parent Integration
     *
     * Optional because a webhook may be a platform-native endpoint rather
     * than belonging to a configured Integration.
     * =========================================================================
     */
    integrationId?: string;



    /**
     * =========================================================================
     * Identity
     * =========================================================================
     */
    name: string;



    /**
     * =========================================================================
     * Destination
     * =========================================================================
     */
    url: string;



    /**
     * =========================================================================
     * HTTP Method
     * =========================================================================
     */
    method: WebhookMethod;



    /**
     * =========================================================================
     * Secret Reference
     *
     * Reference only.
     *
     * Never store the actual signing secret/API credential in this contract.
     * =========================================================================
     */
    secretReference?: string;



    /**
     * =========================================================================
     * Lifecycle
     * =========================================================================
     */
    status: WebhookStatus;



    /**
     * =========================================================================
     * Runtime Enablement
     * =========================================================================
     */
    enabled: boolean;



    /**
     * =========================================================================
     * Retry Configuration
     *
     * Number of retries permitted after an unsuccessful delivery.
     */
    retryCount: number;



    /**
     * =========================================================================
     * Request Timeout
     *
     * Maximum outbound request duration in seconds.
     * =========================================================================
     */
    timeoutSeconds: number;



    /**
     * =========================================================================
     * Runtime Tracking
     * =========================================================================
     */
    lastTriggeredAt?: string;



    /**
     * =========================================================================
     * Extension Metadata
     * =========================================================================
     */
    metadata?: Record<string, unknown>;



    /**
     * =========================================================================
     * Audit
     * =========================================================================
     */
    createdBy?: string;

    updatedBy?: string;

}
