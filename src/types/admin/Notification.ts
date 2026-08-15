/**
 * ============================================================================
 * Abhimaan Digital Solutionz
 *
 * Notification
 *
 * Enterprise User Notification Contract
 * CRM + Admin Compatible
 * Production SaaS Contract
 * ============================================================================
 *
 * Represents an in-application notification.
 *
 * Notification record ≠ delivery mechanism.
 *
 * Email, push, SMS, realtime delivery and retry handling belong to the
 * notification/delivery service layer.
 * ============================================================================
 */


/**
 * Notification severity/type.
 */
export type NotificationType =
    | "INFO"
    | "SUCCESS"
    | "WARNING"
    | "ERROR";



/**
 * Notification read state.
 */
export type NotificationStatus =
    | "READ"
    | "UNREAD";



/**
 * Enterprise notification contract.
 */
export interface Notification {


    /**
     * Notification identity.
     */
    id: string;



    /**
     * Tenant ownership.
     */
    organizationId?: string;



    /**
     * Intended recipient.
     *
     * A null/undefined userId may represent an organization-level
     * notification where supported by the application.
     */
    userId?: string | null;



    /**
     * Notification title.
     */
    title: string;



    /**
     * Notification body.
     */
    message: string;



    /**
     * Notification classification.
     */
    type: NotificationType;



    /**
     * Current read state.
     */
    status: NotificationStatus;



    /**
     * Optional originating entity type.
     *
     * Examples:
     * lead, company, task, invoice.
     */
    entityType?: string | null;



    /**
     * Optional originating entity identity.
     */
    entityId?: string | null;



    /**
     * Optional application route/action URL.
     */
    actionUrl?: string | null;



    /**
     * Extensible non-sensitive metadata.
     */
    metadata?: Record<string, unknown>;



    /**
     * Creation timestamp.
     */
    createdAt?: string;



    /**
     * Timestamp at which the recipient read the notification.
     */
    readAt?: string | null;

}