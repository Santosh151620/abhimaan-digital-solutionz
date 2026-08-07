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



        this.handlers.set(

            event,

            handlers.filter(

                existing => existing !== handler,

            ),

        );

    }



    async publish(

        event: WorkflowEvent,

    ): Promise<void> {


        const handlers = [

            ...(this.handlers.get(event.name) ?? []),

        ];



        for (const handler of handlers) {


            try {

                await handler(event);

            }

            catch (error) {


                console.error(

                    "Workflow event handler failed",

                    {

                        event:
                            event.name,

                        error,

                    },

                );

            }

        }

    }


}



export const eventBus =
    new EventBus();