export type LocationStatus =
    | "Active"
    | "Inactive";



export interface Location {


    id: string;



    organizationId?: string;



    locationCode: string;



    locationName: string;



    description?: string | null;



    addressLine1?: string | null;



    addressLine2?: string | null;



    city?: string | null;



    state?: string | null;



    country?: string | null;



    postalCode?: string | null;



    status: LocationStatus;



    metadata?: Record<string, unknown>;



    createdAt?: string;



    updatedAt?: string;


}