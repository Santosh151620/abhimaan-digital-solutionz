import type {
    WorkflowEventName,
} from "@/types/workflow/Events";

import type {
    WorkflowEventHandler,
} from "@/services/workflow/EventBus";

import {
    eventBus,
} from "@/services/workflow/EventBus";

export function subscribe(

    event: WorkflowEventName,

    handler: WorkflowEventHandler

): void {

    eventBus.subscribe(

        event,

        handler

    );

}
