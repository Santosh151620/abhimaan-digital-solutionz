import type {
    WorkflowRule,
} from "@/types/workflow/Workflow";

export class WorkflowRepository {

    private readonly rules =
        new Map<string, WorkflowRule>();

    async list(): Promise<WorkflowRule[]> {

        return [
            ...this.rules.values(),
        ];

    }

    async find(
        id: string
    ): Promise<WorkflowRule | null> {

        return this.rules.get(id) ?? null;

    }

    async save(
        rule: WorkflowRule
    ): Promise<void> {

        this.rules.set(

            rule.id,

            rule

        );

    }

    async delete(
        id: string
    ): Promise<void> {

        this.rules.delete(id);

    }

}
