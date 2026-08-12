import type {
    WorkflowEventName,
} from "./Events";


type WorkflowActionType =
    | "notification"
    | "task"
    | "email"
    | "webhook";


type WorkflowTrigger =
    | "Manual"
    | "Automatic"
    | "Event"
    | "Schedule";


type WorkflowStatus =
    | "Active"
    | "Inactive"
    | "Draft";


export interface Workflow {


    id: string;


    organizationId: string;


    workflowCode: string;


    workflowName: string;


    description:
        string | null;


    triggerType:
        WorkflowTrigger;


    entityType:
        string | null;


    actionType:
        string | null;


    configuration:
        Record<string, unknown>;


    status:
        WorkflowStatus;


    isSystem:
        boolean;


    createdAt:
        string;


    updatedAt:
        string;

}



export interface WorkflowContext {


    organizationId:
        string;


    entityType:
        string;


    entityId:
        string;


    initiatedBy?:
        string;


    payload?:
        Record<string, unknown>;

}



interface WorkflowAction {


    id:
        string;


    type:
        WorkflowActionType;


    configuration:
        Record<string, unknown>;

}



export interface WorkflowRule {


    id:
        string;


    name:
        string;


    event:
        WorkflowEventName;


    enabled:
        boolean;


    actions:
        WorkflowAction[];

}

