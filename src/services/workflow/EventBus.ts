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

        handler: WorkflowEventHandler,

    ): void {


        if (
            !event
        ) {

            throw new Error(
                "Workflow event name is required.",
            );

        }


        if (
            typeof handler !== "function"
        ) {

            throw new Error(
                "Workflow event handler is required.",
            );

        }


        const handlers =
            this.handlers.get(event) ?? [];


        if (
            handlers.includes(handler)
        ) {

            return;

        }


        handlers.push(

            handler,

        );


        this.handlers.set(

            event,

            handlers,

        );

    }



    unsubscribe(

        event: WorkflowEventName,

        handler: WorkflowEventHandler,

    ): void {


        const handlers =
            this.handlers.get(event);


        if (!handlers) {

            return;

        }


        const remainingHandlers =
            handlers.filter(

                existing =>
                    existing !== handler,

            );


        if (
            remainingHandlers.length === 0
        ) {

            this.handlers.delete(

                event,

            );

            return;

        }


        this.handlers.set(

            event,

            remainingHandlers,

        );

    }



    async publish(

        event: WorkflowEvent,

    ): Promise<void> {


        if (
            !event?.name
        ) {

            throw new Error(
                "Workflow event is required.",
            );

        }


        if (
            !event.context
        ) {

            throw new Error(
                "Workflow event context is required.",
            );

        }


        const handlers = [

            ...(this.handlers.get(event.name) ?? []),

        ];


        for (
            const handler of handlers
        ) {


            try {


                await handler(

                    event,

                );


            }

            catch (error) {


                console.error(

                    "Workflow event handler failed",

                    {

                        event:
                            event.name,

                        organizationId:
                            event.context
                                .organizationId,

                        entityType:
                            event.context
                                .entityType,

                        entityId:
                            event.context
                                .entityId,

                        error,

                    },

                );

            }

        }

    }


}



export const eventBus =
    new EventBus();