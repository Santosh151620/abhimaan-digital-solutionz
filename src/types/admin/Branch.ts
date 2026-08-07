export type BranchStatus =

    | "Active"

    | "Inactive";





export interface Branch {



    id: string;





    organizationId?: string;





    locationId?: string | null;





    branchCode: string;





    branchName: string;





    description?: string | null;





    addressLine1?: string | null;





    addressLine2?: string | null;





    city?: string | null;





    state?: string | null;





    country?: string | null;





    postalCode?: string | null;





    phone?: string | null;





    email?: string | null;





    status: BranchStatus;





    metadata?: Record<string, unknown>;





    createdAt?: string;





    updatedAt?: string;



}