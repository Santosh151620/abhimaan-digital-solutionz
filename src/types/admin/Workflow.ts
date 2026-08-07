export type WorkflowStatus =

    | "Active"

    | "Inactive";





export type WorkflowTrigger =

    | "Manual"

    | "Event"

    | "Schedule";





export interface Workflow {



    id: string;





    organizationId?: string;





    workflowCode: string;





    workflowName: string;





    description?: string | null;





    triggerType: WorkflowTrigger;





    entityType?: string | null;





    actionType?: string | null;





    configuration?: Record<string, unknown>;





    status: WorkflowStatus;





    isSystem?: boolean;





    createdAt?: string;





    updatedAt?: string;



}