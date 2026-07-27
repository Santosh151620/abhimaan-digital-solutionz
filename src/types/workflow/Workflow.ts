import type { WorkflowEventName } from "./Events";

export interface WorkflowContext {

    organizationId: string;

    entityType: string;

    entityId: string;

    initiatedBy?: string;

    payload?: Record<string, unknown>;

}

export interface WorkflowAction {

    id: string;

    type: string;

    configuration: Record<string, unknown>;

}

export interface WorkflowRule {

    id: string;

    name: string;

    event: WorkflowEventName;

    enabled: boolean;

    actions: WorkflowAction[];

}
