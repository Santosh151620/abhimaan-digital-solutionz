import type {
    WorkflowContext,
} from "@/types/workflow/Workflow";

import type {
    WorkflowEventName,
} from "@/types/workflow/Events";

import {
    workflowService,
} from "@/services/workflow/WorkflowService";

export async function publish(

    event: WorkflowEventName,

    context: WorkflowContext

): Promise<void> {

    await workflowService.publish(

        event,

        context

    );

}
