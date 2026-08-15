/**
 * ============================================================================
 * Abhimaan Digital Solutionz
 *
 * Branch
 *
 * Enterprise Organization / Location Contract
 * ============================================================================
 *
 * Contract-only definition.
 *
 * Branch persistence, organization authorization, uniqueness validation and
 * location relationships belong to the service/repository layers.
 * ============================================================================
 */


/**
 * Branch lifecycle status.
 */
export type BranchStatus =
    | "Active"
    | "Inactive";



/**
 * Enterprise branch contract.
 */
export interface Branch {


    /**
     * Unique branch identifier.
     */
    id: string;



    /**
     * Organization owning the branch.
     */
    organizationId?: string;



    /**
     * Optional parent location reference.
     */
    locationId?: string | null;



    /**
     * Stable organization-scoped branch code.
     */
    branchCode: string;



    /**
     * Human-readable branch name.
     */
    branchName: string;



    /**
     * Optional branch description.
     */
    description?: string | null;



    /**
     * Physical address.
     */
    addressLine1?: string | null;

    addressLine2?: string | null;

    city?: string | null;

    state?: string | null;

    country?: string | null;

    postalCode?: string | null;



    /**
     * Branch contact information.
     */
    phone?: string | null;

    email?: string | null;



    /**
     * Branch lifecycle status.
     */
    status: BranchStatus;



    /**
     * Extensible non-sensitive branch metadata.
     */
    metadata?: Record<string, unknown>;



    /**
     * Creation timestamp.
     */
    createdAt?: string;



    /**
     * Last modification timestamp.
     */
    updatedAt?: string;

}