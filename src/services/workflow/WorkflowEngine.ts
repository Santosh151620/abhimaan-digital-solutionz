import type {
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

        event: WorkflowEventName,

        context: WorkflowContext,

    ): Promise<void> {


        const rules =
            workflowRegistry.getRules(
                event,
            );


        for (const rule of rules) {


            if (!rule.enabled) {

                continue;

            }


            await this.executeRule(

                rule,

                context,

            );

        }

    }



    private async executeRule(

        rule: WorkflowRule,

        context: WorkflowContext,

    ): Promise<void> {


        for (const action of rule.actions) {


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



                default:

                    break;

            }

        }

    }



    private async executeNotification(

        action: unknown,

        context: WorkflowContext,

    ): Promise<void> {

        void action;

        void context;

    }



    private async executeTask(

        action: unknown,

        context: WorkflowContext,

    ): Promise<void> {

        void action;

        void context;

    }



    private async executeEmail(

        action: unknown,

        context: WorkflowContext,

    ): Promise<void> {

        void action;

        void context;

    }



    private async executeWebhook(

        action: unknown,

        context: WorkflowContext,

    ): Promise<void> {

        void action;

        void context;

    }


}


export const workflowEngine =
    new WorkflowEngine();