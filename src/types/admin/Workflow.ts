/**
 * ============================================================================
 * Abhimaan Digital Solutionz
 *
 * Workflow Definition
 *
 * Enterprise Automation Contract
 *
 * Compatible with:
 * - Admin
 * - CRM
 * - ERP
 * - Notifications
 * - Integrations
 * - AI Automation
 *
 * Architecture:
 * Workflow Definition
 *      ↓
 * Trigger
 *      ↓
 * Execution
 *      ↓
 * Actions
 *
 * Security:
 * - Tenant ownership is enforced by repository/RLS.
 * - System workflows are platform-controlled.
 * - Runtime execution state does not belong in this contract.
 * ============================================================================
 */



/**
 * ============================================================================
 * Workflow Lifecycle
 * ============================================================================
 */

export type WorkflowStatus =
    | "Active"
    | "Inactive";



/**
 * ============================================================================
 * Workflow Trigger
 * ============================================================================
 */

export type WorkflowTrigger =
    | "Manual"
    | "Event"
    | "Schedule";



/**
 * ============================================================================
 * Workflow Definition
 * ============================================================================
 */

export interface Workflow {

    /**
     * =========================================================================
     * Identity
     * =========================================================================
     */
    id: string;



    /**
     * =========================================================================
     * Tenant Ownership
     *
     * Undefined means platform-level workflow.
     * Defined means organization-scoped workflow.
     *
     * Repository/RLS remains responsible for enforcing ownership.
     * =========================================================================
     */
    organizationId?: string;



    /**
     * =========================================================================
     * Stable machine-readable identifier.
     *
     * Example:
     * lead.followup
     * opportunity.created
     * invoice.payment.reminder
     * =========================================================================
     */
    workflowCode: string;



    /**
     * =========================================================================
     * Human-readable workflow name.
     * =========================================================================
     */
    workflowName: string;



    /**
     * =========================================================================
     * Optional description.
     * =========================================================================
     */
    description?: string | null;



    /**
     * =========================================================================
     * Workflow trigger mechanism.
     * =========================================================================
     */
    triggerType: WorkflowTrigger;



    /**
     * =========================================================================
     * Optional entity associated with the workflow.
     *
     * Examples:
     * - lead
     * - opportunity
     * - quotation
     * - invoice
     * - ticket
     * =========================================================================
     */
    entityType?: string | null;



    /**
     * =========================================================================
     * Optional primary action classification.
     *
     * Examples:
     * - CREATE
     * - UPDATE
     * - DELETE
     * - APPROVE
     * - SEND_NOTIFICATION
     * =========================================================================
     */
    actionType?: string | null;



    /**
     * =========================================================================
     * Declarative workflow configuration.
     *
     * Contains workflow-specific configuration only.
     *
     * Runtime execution state, credentials, secrets, and audit records
     * must not be stored here.
     * =========================================================================
     */
    configuration?: Record<
        string,
        unknown
    >;



    /**
     * =========================================================================
     * Lifecycle status.
     * =========================================================================
     */
    status: WorkflowStatus;



    /**
     * =========================================================================
     * Platform/system ownership.
     *
     * System workflows cannot be modified or deleted by organization
     * administrators unless explicitly permitted by governance rules.
     * =========================================================================
     */
    isSystem: boolean;



    /**
     * =========================================================================
     * Audit timestamps.
     * =========================================================================
     */
    createdAt?: string;

    updatedAt?: string;

}
