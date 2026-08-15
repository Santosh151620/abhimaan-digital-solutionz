/**
 * ============================================================================
 * Abhimaan Digital Solutionz
 *
 * Designation
 *
 * Enterprise Organization Structure Contract
 * ============================================================================
 *
 * Contract-only definition.
 *
 * Designation hierarchy, organization ownership, department relationships,
 * authorization and persistence rules belong to the service/repository/
 * database layers.
 * ============================================================================
 */


/**
 * Designation lifecycle status.
 */
export type DesignationStatus =
    | "Active"
    | "Inactive";



/**
 * Enterprise designation contract.
 */
export interface Designation {


    /**
     * Unique designation identifier.
     */
    id: string;



    /**
     * Organization owning the designation.
     */
    organizationId: string;



    /**
     * Optional department association.
     */
    departmentId?: string;



    /**
     * Stable organization-scoped designation code.
     */
    designationCode: string;



    /**
     * Human-readable designation name.
     */
    designationName: string;



    /**
     * Optional designation description.
     */
    description?: string;



    /**
     * Designation lifecycle status.
     */
    status: DesignationStatus;



    /**
     * Extensible designation metadata.
     */
    metadata: Record<string, unknown>;



    /**
     * Creation timestamp.
     */
    createdAt: string;



    /**
     * Last modification timestamp.
     */
    updatedAt: string;

}