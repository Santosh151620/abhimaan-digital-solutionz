import type {
    WorkflowContext,
} from "@/types/workflow/Workflow";

import type {
    WorkflowEventName,
} from "@/types/workflow/Events";

import {
    eventBus,
} from "./EventBus";

import {
    workflowEngine,
} from "./WorkflowEngine";

export class WorkflowService {

    async publish(

        event: WorkflowEventName,

        context: WorkflowContext

    ): Promise<void> {

        await eventBus.publish({

            name: event,

            context,

        });

        await workflowEngine.execute(

            event,

            context

        );

    }

}

export const workflowService =
    new WorkflowService();