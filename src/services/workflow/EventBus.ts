import type {
    WorkflowContext,
} from "@/types/workflow/Workflow";

import type {
    WorkflowEventName,
} from "@/types/workflow/Events";

export interface WorkflowEvent {

    name: WorkflowEventName;

    context: WorkflowContext;

}

export type WorkflowEventHandler =
    (
        event: WorkflowEvent
    ) => Promise<void> | void;

class EventBus {

    private readonly handlers =
        new Map<
            WorkflowEventName,
            WorkflowEventHandler[]
        >();

    subscribe(
        event: WorkflowEventName,
        handler: WorkflowEventHandler
    ): void {

        const handlers =
            this.handlers.get(event) ?? [];

        handlers.push(handler);

        this.handlers.set(
            event,
            handlers
        );

    }

    unsubscribe(
        event: WorkflowEventName,
        handler: WorkflowEventHandler
    ): void {

        const handlers =
            this.handlers.get(event);

        if (!handlers) {

            return;

        }

        this.handlers.set(
            event,
            handlers.filter(
                h => h !== handler
            )
        );

    }

    async publish(
        event: WorkflowEvent
    ): Promise<void> {

        const handlers =
            this.handlers.get(event.name);

        if (!handlers?.length) {

            return;

        }

        for (const handler of handlers) {

            await handler(event);

        }

    }

}

export const eventBus =
    new EventBus();