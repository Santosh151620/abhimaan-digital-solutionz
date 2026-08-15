/**
 * ============================================================================
 * ADS ENTERPRISE PLATFORM
 *
 * Team Contract
 *
 * Enterprise Organization Structure
 * CRM + Admin Compatible
 * Multi-Tenant
 * SaaS / On-Prem Ready
 *
 * Hierarchy:
 *
 * Organization
 *      ↓
 * Department
 *      ↓
 * Team
 *      ↓
 * Team Lead / Members
 * ============================================================================
 */



/**
 * ============================================================================
 * Team Status
 * ============================================================================
 */
export type TeamStatus =
    | "Active"
    | "Inactive";



/**
 * ============================================================================
 * Team
 *
 * Represents an organizational team belonging to an organization.
 *
 * Team is intentionally kept separate from Department:
 *
 * Department = organizational business unit
 * Team       = operational group within a department
 * ============================================================================
 */
export interface Team {


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
     * Optional at the TypeScript contract level to remain compatible with
     * existing platform/admin repository models.
     *
     * Persistence and RLS must enforce organization ownership.
     * =========================================================================
     */
    organizationId?: string;



    /**
     * =========================================================================
     * Department Relationship
     *
     * A team may optionally belong to a department.
     * =========================================================================
     */
    departmentId?: string | null;



    /**
     * =========================================================================
     * Business Identity
     * =========================================================================
     */
    teamCode: string;

    teamName: string;



    /**
     * =========================================================================
     * Description
     * =========================================================================
     */
    description?: string | null;



    /**
     * =========================================================================
     * Team Leadership
     *
     * References the user responsible for the team.
     * =========================================================================
     */
    teamLeadId?: string | null;



    /**
     * =========================================================================
     * Lifecycle
     * =========================================================================
     */
    status: TeamStatus;



    /**
     * =========================================================================
     * Extension Metadata
     * =========================================================================
     */
    metadata?: Record<string, unknown>;



    /**
     * =========================================================================
     * Audit / Persistence
     * =========================================================================
     */
    createdAt?: string;

    updatedAt?: string;

}
