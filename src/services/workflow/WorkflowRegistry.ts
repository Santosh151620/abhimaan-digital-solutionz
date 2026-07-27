import type {
    WorkflowRule,
} from "@/types/workflow/Workflow";

import type {
    WorkflowEventName,
} from "@/types/workflow/Events";

class WorkflowRegistry {

    private readonly rules =
        new Map<
            WorkflowEventName,
            WorkflowRule[]
        >();

    register(
        rule: WorkflowRule
    ): void {

        const rules =
            this.rules.get(rule.event) ?? [];

        rules.push(rule);

        this.rules.set(
            rule.event,
            rules
        );

    }

    getRules(
        event: WorkflowEventName
    ): WorkflowRule[] {

        return this.rules.get(event) ?? [];

    }

    clear(): void {

        this.rules.clear();

    }

}

export const workflowRegistry =
    new WorkflowRegistry();
