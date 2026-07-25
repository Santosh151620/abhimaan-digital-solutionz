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
        context: WorkflowContext
    ): Promise<void> {

        const rules =
            workflowRegistry.getRules(event);

        for (const rule of rules) {

            if (!rule.enabled) {
                continue;
            }

            await this.executeRule(
                rule,
                context
            );

        }

    }

    private async executeRule(
        rule: WorkflowRule,
        context: WorkflowContext
    ): Promise<void> {

        void context;

        for (const action of rule.actions) {

            switch (action.type) {

                case "notification":
                    break;

                case "task":
                    break;

                case "email":
                    break;

                case "webhook":
                    break;

                default:
                    break;

            }

        }

    }

}

export const workflowEngine =
    new WorkflowEngine();