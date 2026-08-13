import type {
    Workflow,
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



export interface WorkflowExecutionOptions {

    publishEvent?: boolean;

}



export class WorkflowService {


    async publish(

        event:
            WorkflowEventName,

        context:
            WorkflowContext,

    ): Promise<void> {


        this.validateEvent(
            event,
        );


        this.validateContext(
            context,
        );


        await eventBus.publish({

            name:
                event,

            context,

        });


        await workflowEngine.execute(

            event,

            context,

        );

    }



    async execute(

        event:
            WorkflowEventName,

        context:
            WorkflowContext,

    ): Promise<void> {


        this.validateEvent(
            event,
        );


        this.validateContext(
            context,
        );


        await workflowEngine.execute(

            event,

            context,

        );

    }



    async trigger(

        event:
            WorkflowEventName,

        context:
            WorkflowContext,

        options:
            WorkflowExecutionOptions = {},

    ): Promise<void> {


        this.validateEvent(
            event,
        );


        this.validateContext(
            context,
        );


        const {
            publishEvent = true,
        } = options;


        if (
            publishEvent
        ) {

            await eventBus.publish({

                name:
                    event,

                context,

            });

        }


        await workflowEngine.execute(

            event,

            context,

        );

    }



    async executeWorkflow(

        workflow:
            Workflow,

        context:
            WorkflowContext,

    ): Promise<void> {


        this.validateWorkflow(
            workflow,
        );


        this.validateContext(
            context,
        );


        if (
            workflow.organizationId !==
            context.organizationId
        ) {

            throw new Error(

                "Workflow organization does not match execution context.",

            );

        }


        if (
            workflow.status !==
            "Active"
        ) {

            return;

        }


        if (
            workflow.triggerType !==
            "Event"
        ) {

            throw new Error(

                "Only event-triggered workflows can be executed directly.",

            );

        }


        const configuredEvent =
            workflow.configuration?.event;


        if (
            typeof configuredEvent !==
            "string" ||
            !configuredEvent.trim()
        ) {

            throw new Error(

                "Workflow event configuration is required.",

            );

        }


        const event =
            configuredEvent.trim() as WorkflowEventName;


        await workflowEngine.execute(

            event,

            context,

        );

    }



    private validateEvent(

        event:
            WorkflowEventName,

    ): void {


        if (
            typeof event !==
                "string" ||
            !event.trim()
        ) {

            throw new Error(

                "Workflow event is required.",

            );

        }

    }



    private validateWorkflow(

        workflow:
            Workflow,

    ): void {


        if (!workflow) {

            throw new Error(

                "Workflow is required.",

            );

        }


        if (
            typeof workflow.id !==
                "string" ||
            !workflow.id.trim()
        ) {

            throw new Error(

                "Workflow id is required.",

            );

        }


        if (
            typeof workflow.organizationId !==
                "string" ||
            !workflow.organizationId.trim()
        ) {

            throw new Error(

                "Workflow organization is required.",

            );

        }


        if (
            typeof workflow.workflowCode !==
                "string" ||
            !workflow.workflowCode.trim()
        ) {

            throw new Error(

                "Workflow code is required.",

            );

        }


        if (
            typeof workflow.workflowName !==
                "string" ||
            !workflow.workflowName.trim()
        ) {

            throw new Error(

                "Workflow name is required.",

            );

        }

    }



    private validateContext(

        context:
            WorkflowContext,

    ): void {


        if (!context) {

            throw new Error(

                "Workflow context is required.",

            );

        }


        if (
            typeof context.organizationId !==
                "string" ||
            !context.organizationId.trim()
        ) {

            throw new Error(

                "Workflow organization id is required.",

            );

        }


        if (
            typeof context.entityType !==
                "string" ||
            !context.entityType.trim()
        ) {

            throw new Error(

                "Workflow entity type is required.",

            );

        }


        if (
            typeof context.entityId !==
                "string" ||
            !context.entityId.trim()
        ) {

            throw new Error(

                "Workflow entity id is required.",

            );

        }


        if (
            context.initiatedBy !==
                undefined &&
            (
                typeof context.initiatedBy !==
                    "string" ||
                !context.initiatedBy.trim()
            )
        ) {

            throw new Error(

                "Workflow initiated-by value must be a non-empty string.",

            );

        }

    }

}



export const workflowService =
    new WorkflowService();