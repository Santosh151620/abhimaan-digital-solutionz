import type {
    AutomationExecution,
    AutomationResult,
} from "@/types/workflow/Automation";

export class AutomationService {

    async execute(): Promise<AutomationResult> {

        const executions: AutomationExecution[] = [];

        return {

            success: true,

            executions,

        };

    }

}

export const automationService =
    new AutomationService();
