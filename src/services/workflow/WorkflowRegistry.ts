import type {
    WorkflowAction,
    WorkflowRule,
} from "@/types/workflow/Workflow";


import type {
    WorkflowEventName,
} from "@/types/workflow/Events";



export class WorkflowRegistry {


    private readonly rules =
        new Map<
            WorkflowEventName,
            Map<string, WorkflowRule>
        >();




    register(
        rule: WorkflowRule,
    ): void {


        this.validateRule(
            rule,
        );


        const normalizedRule =
            this.normalizeRule(
                rule,
            );


        const eventRules =
            this.rules.get(
                normalizedRule.event,
            ) ??
            new Map<
                string,
                WorkflowRule
            >();


        eventRules.set(
            normalizedRule.id,
            normalizedRule,
        );


        this.rules.set(
            normalizedRule.event,
            eventRules,
        );

    }




    registerMany(
        rules: WorkflowRule[],
    ): void {


        if (!Array.isArray(rules)) {

            throw new Error(
                "Workflow rules must be an array.",
            );

        }


        for (const rule of rules) {

            this.register(
                rule,
            );

        }

    }




    unregister(
        event: WorkflowEventName,
        ruleId: string,
    ): boolean {


        if (!event) {

            throw new Error(
                "Workflow event is required.",
            );

        }


        const normalizedRuleId =
            this.validateRuleId(
                ruleId,
            );


        const eventRules =
            this.rules.get(
                event,
            );


        if (!eventRules) {

            return false;

        }


        const deleted =
            eventRules.delete(
                normalizedRuleId,
            );


        if (
            eventRules.size === 0
        ) {

            this.rules.delete(
                event,
            );

        }


        return deleted;

    }




    getRules(
        event: WorkflowEventName,
    ): WorkflowRule[] {


        if (!event) {

            throw new Error(
                "Workflow event is required.",
            );

        }


        const eventRules =
            this.rules.get(
                event,
            );


        if (!eventRules) {

            return [];

        }


        return Array.from(
            eventRules.values(),
            (
                rule,
            ) =>
                this.cloneRule(
                    rule,
                ),
        );

    }




    getRule(
        event: WorkflowEventName,
        ruleId: string,
    ): WorkflowRule | null {


        if (!event) {

            throw new Error(
                "Workflow event is required.",
            );

        }


        const normalizedRuleId =
            this.validateRuleId(
                ruleId,
            );


        const rule =
            this.rules
                .get(event)
                ?.get(normalizedRuleId);


        return rule
            ? this.cloneRule(
                rule,
            )
            : null;

    }




    hasRule(
        event: WorkflowEventName,
        ruleId: string,
    ): boolean {


        if (!event) {

            throw new Error(
                "Workflow event is required.",
            );

        }


        const normalizedRuleId =
            this.validateRuleId(
                ruleId,
            );


        return (
            this.rules
                .get(event)
                ?.has(normalizedRuleId)
            ??
            false
        );

    }




    clearEvent(
        event: WorkflowEventName,
    ): void {


        if (!event) {

            throw new Error(
                "Workflow event is required.",
            );

        }


        this.rules.delete(
            event,
        );

    }




    clear(): void {

        this.rules.clear();

    }




    private validateRule(
        rule: WorkflowRule,
    ): void {


        if (!rule) {

            throw new Error(
                "Workflow rule is required.",
            );

        }


        this.validateRuleId(
            rule.id,
        );


        if (
            typeof rule.name !==
                "string" ||
            !rule.name.trim()
        ) {

            throw new Error(
                "Workflow rule name is required.",
            );

        }


        if (
            !rule.event
        ) {

            throw new Error(
                "Workflow rule event is required.",
            );

        }


        if (
            !Array.isArray(
                rule.actions,
            )
        ) {

            throw new Error(
                "Workflow rule actions are required.",
            );

        }


        for (
            const action of rule.actions
        ) {

            this.validateAction(
                action,
            );

        }

    }




    private validateAction(
        action: WorkflowAction,
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


        const supportedTypes =
            new Set<WorkflowAction["type"]>([
                "notification",
                "task",
                "email",
                "webhook",
            ]);


        if (
            !supportedTypes.has(
                action.type,
            )
        ) {

            throw new Error(
                `Unsupported workflow action type: ${String(action.type)}.`,
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
                "Workflow action configuration must be an object.",
            );

        }

    }




    private validateRuleId(
        ruleId: string,
    ): string {


        const normalizedRuleId =
            typeof ruleId ===
                "string"
                ? ruleId.trim()
                : "";


        if (!normalizedRuleId) {

            throw new Error(
                "Workflow rule id is required.",
            );

        }


        return normalizedRuleId;

    }




    private normalizeRule(
        rule: WorkflowRule,
    ): WorkflowRule {


        return {

            ...rule,

            id:
                rule.id.trim(),

            name:
                rule.name.trim(),

            actions:
                rule.actions.map(
                    (
                        action,
                    ) => ({

                        ...action,

                        id:
                            action.id.trim(),

                        configuration:
                            {
                                ...action.configuration,
                            },

                    }),
                ),

        };

    }




    private cloneRule(
        rule: WorkflowRule,
    ): WorkflowRule {


        return {
            ...rule,
            actions:
                rule.actions.map(
                    (
                        action,
                    ) => ({
                        ...action,
                        configuration:
                            {
                                ...action.configuration,
                            },
                    }),
                ),
        };
    }
}
export const workflowRegistry =
    new WorkflowRegistry();