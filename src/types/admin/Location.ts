/**
 * ============================================================================
 * Abhimaan Digital Solutionz
 *
 * Location
 *
 * Enterprise Organization Location Contract
 * CRM + Admin Compatible
 * Production SaaS Contract
 * ============================================================================
 *
 * Represents a physical/logical organization location.
 *
 * Location is intentionally separate from Branch:
 *
 * Location → geographic/business location
 * Branch   → operational branch associated with a location
 * ============================================================================
 */

export type LocationStatus =
    | "Active"
    | "Inactive";



export interface Location {


    /**
     * Location identity.
     */
    id: string;



    /**
     * Optional organization ownership.
     *
     * Undefined may represent a platform-level location where applicable.
     */
    organizationId?: string;



    /**
     * Unique organization/location code.
     */
    locationCode: string;



    /**
     * Human-readable location name.
     */
    locationName: string;



    /**
     * Optional description.
     */
    description?: string | null;



    /**
     * Address information.
     */
    addressLine1?: string | null;

    addressLine2?: string | null;

    city?: string | null;

    state?: string | null;

    country?: string | null;

    postalCode?: string | null;



    /**
     * Location lifecycle state.
     */
    status: LocationStatus;



    /**
     * Extensible non-sensitive metadata.
     */
    metadata?: Record<string, unknown>;



    /**
     * Audit timestamps.
     */
    createdAt?: string;

    updatedAt?: string;

}