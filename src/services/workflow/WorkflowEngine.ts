import type {
    WorkflowAction,
    WorkflowContext,
    WorkflowRule,
} from "@/types/workflow/Workflow";


import type {
    WorkflowEventName,
} from "@/types/workflow/Events";


import {
    workflowRegistry,
} from "./WorkflowRegistry";



export class WorkflowEngine {


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


        const rules =
            workflowRegistry.getRules(
                event,
            );


        for (const rule of rules) {


            if (!rule.enabled) {

                continue;

            }


            try {

                this.validateRule(
                    rule,
                );


                await this.executeRule(

                    rule,

                    context,

                );

            }

            catch (error) {

                console.error(

                    "Workflow rule execution failed",

                    {

                        workflowId:
                            rule.id,

                        event,

                        organizationId:
                            context.organizationId,

                        entityType:
                            context.entityType,

                        entityId:
                            context.entityId,

                        error,

                    },

                );

            }

        }

    }



    private async executeRule(

        rule:
            WorkflowRule,

        context:
            WorkflowContext,

    ): Promise<void> {


        for (const action of rule.actions) {


            await this.executeAction(

                action,

                context,

            );

        }

    }



    private async executeAction(

        action:
            WorkflowAction,

        context:
            WorkflowContext,

    ): Promise<void> {


        this.validateAction(
            action,
        );


        switch (action.type) {


            case "notification":

                await this.executeNotification(

                    action,

                    context,

                );

                break;



            case "task":

                await this.executeTask(

                    action,

                    context,

                );

                break;



            case "email":

                await this.executeEmail(

                    action,

                    context,

                );

                break;



            case "webhook":

                await this.executeWebhook(

                    action,

                    context,

                );

                break;



            default: {

                const exhaustiveAction:
                    never =
                        action.type;

                throw new Error(

                    `Unsupported workflow action type: ${exhaustiveAction}`,

                );

            }

        }

    }



    private async executeNotification(

        action:
            WorkflowAction,

        context:
            WorkflowContext,

    ): Promise<void> {

        void action;

        void context;

        /*
         * Notification delivery remains an
         * integration boundary.
         *
         * The notification service owns delivery;
         * WorkflowEngine only orchestrates execution.
         */

    }



    private async executeTask(

        action:
            WorkflowAction,

        context:
            WorkflowContext,

    ): Promise<void> {

        void action;

        void context;

        /*
         * Task creation remains owned by the
         * CRM task service/repository layer.
         */

    }



    private async executeEmail(

        action:
            WorkflowAction,

        context:
            WorkflowContext,

    ): Promise<void> {

        void action;

        void context;

        /*
         * Email delivery remains owned by the
         * application email/integration layer.
         */

    }



    private async executeWebhook(

        action:
            WorkflowAction,

        context:
            WorkflowContext,

    ): Promise<void> {

        void action;

        void context;

        /*
         * Webhook delivery remains owned by the
         * integration layer.
         *
         * Do not place external HTTP delivery
         * implementation inside this engine.
         */

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

    }



    private validateRule(

        rule:
            WorkflowRule,

    ): void {


        if (!rule) {

            throw new Error(

                "Workflow rule is required.",

            );

        }


        if (
            typeof rule.id !==
                "string" ||
            !rule.id.trim()
        ) {

            throw new Error(

                "Workflow rule id is required.",

            );

        }


        if (
            typeof rule.name !==
                "string" ||
            !rule.name.trim()
        ) {

            throw new Error(

                "Workflow rule name is required.",

            );

        }


        if (!rule.event) {

            throw new Error(

                "Workflow rule event is required.",

            );

        }


        if (!Array.isArray(
            rule.actions,
        )) {

            throw new Error(

                "Workflow rule actions are required.",

            );

        }

    }



    private validateAction(

        action:
            WorkflowAction,

    ): void {


        if (!action) {

            throw new Error(

                "Workflow action is required.",

            );

        }


        if (
            typeof action.id !==
                "string" ||
            !action.id.trim()
        ) {

            throw new Error(

                "Workflow action id is required.",

            );

        }


        if (
            typeof action.type !==
                "string" ||
            !action.type.trim()
        ) {

            throw new Error(

                "Workflow action type is required.",

            );

        }


        if (
            !action.configuration ||
            typeof action.configuration !==
                "object" ||
            Array.isArray(
                action.configuration,
            )
        ) {

            throw new Error(

                "Workflow action configuration is required.",

            );

        }

    }

}



export const workflowEngine =
    new WorkflowEngine();