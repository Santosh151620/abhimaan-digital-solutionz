type PolicyStatus =

    | "Active"

    | "Inactive";





type PolicyType =

    | "System"

    | "Organization"

    | "Security"

    | "Workflow";





export interface Policy {



    id: string;





    organizationId?: string;





    policyCode: string;





    policyName: string;





    description?: string | null;





    type: PolicyType;





    value?: Record<string, unknown>;





    isMandatory?: boolean;





    status: PolicyStatus;





    createdAt?: string;





    updatedAt?: string;



}