/**
 * ============================================================================
 * Platform Ownership Contracts
 *
 * Common ownership rules across:
 * - CRM
 * - Admin
 * - AI
 * - Enterprise Modules
 *
 * ============================================================================
 */


/**
 * Organization scoped entity
 */
export interface OrganizationOwned {

    organizationId: string;

}


/**
 * User owned entity
 */
export interface UserOwned {

    userId: string;

}


/**
 * Module owned entity
 */
export interface ModuleOwned {

    moduleCode: string;

}


/**
 * Generic entity reference
 *
 * Used by:
 * - Activities
 * - Notes
 * - Attachments
 * - Notifications
 * - Tasks
 *
 * Never create:
 * leadId
 * clientId
 * projectId
 *
 * Always use:
 * entityType + entityId
 */
export interface EntityReference {

    entityType: string;

    entityId: string;

}
