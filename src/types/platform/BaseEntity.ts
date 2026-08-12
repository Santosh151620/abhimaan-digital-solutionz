/**
 * ============================================================================
 * Platform Base Entity
 *
 * Universal entity contract.
 *
 * Used by:
 * - CRM
 * - Admin
 * - AI Platform
 * - Future Enterprise Modules
 *
 * Rules:
 * - Every business entity must extend this contract.
 * - Multi-tenant isolation uses organizationId.
 * - Entity engine uses entityType/entityId references.
 * ============================================================================
 */

export interface BaseEntity {

    /**
     * Unique entity identifier
     */
    id: string;


    /**
     * Multi tenant organization ownership
     */
    organizationId?: string;


    /**
     * Entity discriminator
     *
     * Example:
     * Lead
     * Contact
     * Company
     * Opportunity
     * Invoice
     */
    entityType?: string;


    /**
     * Generic metadata extension point
     */
    metadata?: Record<string, unknown>;


    /**
     * Audit ownership
     */
    createdBy?: string;

    updatedBy?: string;


    /**
     * Lifecycle timestamps
     */
    createdAt: string;

    updatedAt?: string;


    /**
     * Soft delete support
     */
    deletedAt?: string;

}


/**
 * Entities supporting activation lifecycle
 */
interface Activatable {

    isActive: boolean;

}


/**
 * Entities supporting soft deletion
 */
interface SoftDelete {

   deletedAt?: string;

deletedBy?: string;

/** * Soft delete flag  */
isDeleted?: boolean;

}


/**
 * Entities supporting version tracking
 */
interface Versioned {

    version: number;

}
