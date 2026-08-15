/**
 * ============================================================================
 * ADS WORKFLOW EVENT BUS
 * ============================================================================
 *
 * In-process workflow event bus.
 *
 * Responsibilities:
 *
 * - Register workflow event handlers.
 * - Prevent duplicate handler registration.
 * - Unregister handlers safely.
 * - Publish events sequentially to registered handlers.
 * - Isolate handler failures so one handler cannot prevent subsequent
 *   handlers from executing.
 *
 * IMPORTANT:
 *
 * This is an application-level event bus.
 *
 * It is NOT:
 *
 * - a persistent queue;
 * - a distributed event broker;
 * - a replacement for database transactions;
 * - a replacement for authorization or RLS.
 *
 * Workflow business rules remain in WorkflowService / workflow handlers.
 * ============================================================================
 */

import type {
    WorkflowContext,
} from "@/types/workflow/Workflow";


import type {
    WorkflowEventName,
} from "@/types/workflow/Events";



/**
 * Event delivered to workflow handlers.
 */
export interface WorkflowEvent {

    readonly name: WorkflowEventName;

    readonly context: WorkflowContext;

}



/**
 * Workflow event handler contract.
 */
export type WorkflowEventHandler =
    (
        event: WorkflowEvent,
    ) => Promise<void> | void;



/**
 * ============================================================================
 * EVENT BUS
 * ============================================================================
 */

class EventBus {

    /**
     * Event handlers are kept private so consumers cannot mutate the registry
     * without going through subscribe/unsubscribe.
     */
    private readonly handlers:
        Map<
            WorkflowEventName,
            WorkflowEventHandler[]
        > =
        new Map<
            WorkflowEventName,
            WorkflowEventHandler[]
        >();



    /**
     * Subscribe a handler to an event.
     *
     * Duplicate registration of the same function reference is ignored.
     */
    subscribe(
        event: WorkflowEventName,
        handler: WorkflowEventHandler,
    ): void {

        this.assertEventName(
            event,
        );


        this.assertHandler(
            handler,
        );


        const handlers =
            this.handlers.get(
                event,
            ) ?? [];


        if (
            handlers.includes(
                handler,
            )
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



    /**
     * Remove a previously registered handler.
     *
     * Removing an unknown handler is intentionally a no-op.
     */
    unsubscribe(
        event: WorkflowEventName,
        handler: WorkflowEventHandler,
    ): void {

        this.assertEventName(
            event,
        );


        this.assertHandler(
            handler,
        );


        const handlers =
            this.handlers.get(
                event,
            );


        if (!handlers) {

            return;

        }


        const remainingHandlers =
            handlers.filter(
                existing =>
                    existing !== handler,
            );


        if (
            remainingHandlers.length ===
            handlers.length
        ) {

            return;

        }


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



    /**
     * Publish a workflow event.
     *
     * A snapshot of the handler list is taken before execution. This prevents
     * subscriptions/unsubscriptions performed by a handler from unexpectedly
     * changing the current dispatch cycle.
     *
     * Handlers execute sequentially and independently. A failure is logged
     * and the next handler continues.
     */
    async publish(
        event: WorkflowEvent,
    ): Promise<void> {

        this.assertEvent(
            event,
        );


        const handlers = [
            ...(
                this.handlers.get(
                    event.name,
                ) ?? []
            ),
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

                this.logHandlerFailure(
                    event,
                    error,
                );

            }

        }

    }



    /**
     * Validate a workflow event name.
     */
    private assertEventName(
        event: WorkflowEventName,
    ): void {

        if (
            typeof event !== "string" ||
            event.trim().length === 0
        ) {

            throw new Error(
                "Workflow event name is required.",
            );

        }

    }



    /**
     * Validate a workflow event handler.
     */
    private assertHandler(
        handler: WorkflowEventHandler,
    ): void {

        if (
            typeof handler !== "function"
        ) {

            throw new Error(
                "Workflow event handler is required.",
            );

        }

    }



    /**
     * Validate the complete event before dispatch.
     */
    private assertEvent(
        event: WorkflowEvent,
    ): void {

        if (
            !event
        ) {

            throw new Error(
                "Workflow event is required.",
            );

        }


        this.assertEventName(
            event.name,
        );


        if (
            !event.context
        ) {

            throw new Error(
                "Workflow event context is required.",
            );

        }


        if (
            typeof event.context.organizationId !==
            "string" ||
            event.context.organizationId
                .trim()
                .length === 0
        ) {

            throw new Error(
                "Workflow event organization context is required.",
            );

        }

    }



    /**
     * Centralized handler-failure logging.
     *
     * Do not include the complete workflow context because it may contain
     * sensitive or unnecessary application data.
     */
    private logHandlerFailure(
        event: WorkflowEvent,
        error: unknown,
    ): void {

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



/**
 * Canonical application-wide event bus instance.
 */
export const eventBus =
    new EventBus();