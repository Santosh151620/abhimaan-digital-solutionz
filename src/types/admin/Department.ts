/**
 * ============================================================================
 * Abhimaan Digital Solutionz
 *
 * Department
 *
 * Enterprise Organization Structure Contract
 * ============================================================================
 *
 * Contract-only definition.
 *
 * Department hierarchy, manager authorization, tenant isolation and
 * persistence rules belong to the service/repository/database layers.
 * ============================================================================
 */


/**
 * Department lifecycle status.
 */
export type DepartmentStatus =
    | "Active"
    | "Inactive";



/**
 * Enterprise department contract.
 */
export interface Department {


    /**
     * Unique department identifier.
     */
    id: string;



    /**
     * Organization owning the department.
     */
    organizationId: string;



    /**
     * Stable organization-scoped department code.
     */
    departmentCode: string;



    /**
     * Human-readable department name.
     */
    departmentName: string;



    /**
     * Optional parent department.
     *
     * Supports hierarchical organizational structures.
     */
    parentDepartmentId?: string;



    /**
     * Optional department manager/user reference.
     */
    managerId?: string;



    /**
     * Department lifecycle status.
     */
    status: DepartmentStatus;



    /**
     * Extensible department metadata.
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