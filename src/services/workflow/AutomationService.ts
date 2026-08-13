import type {
    AutomationExecution,
    AutomationResult,
} from "@/types/workflow/Automation";


export interface AutomationExecutionInput {

    workflowId: string;

    actionId: string;

    execute: () =>
        Promise<void>;

}


export interface AutomationExecutionOptions {

    continueOnError?: boolean;

}


export class AutomationService {


    async execute(
        executions:
            AutomationExecutionInput[] = [],

        options:
            AutomationExecutionOptions = {},
    ): Promise<AutomationResult> {


        const startedAt =
            new Date();


        const normalizedExecutions =
            this.validateExecutions(
                executions,
            );


        const {
            continueOnError = true,
        } = options;


        const results:
            AutomationExecution[] = [];


        for (
            const execution
            of normalizedExecutions
        ) {


            const executionStartedAt =
                new Date();


            try {

                await execution.execute();


                results.push({

                    workflowId:
                        execution.workflowId,

                    actionId:
                        execution.actionId,

                    success:
                        true,

                    startedAt:
                        executionStartedAt,

                    completedAt:
                        new Date(),

                });

            }

            catch (error) {

                const message =
                    this.getErrorMessage(
                        error,
                    );


                results.push({

                    workflowId:
                        execution.workflowId,

                    actionId:
                        execution.actionId,

                    success:
                        false,

                    message,

                    errorCode:
                        this.getErrorCode(
                            error,
                        ),

                    startedAt:
                        executionStartedAt,

                    completedAt:
                        new Date(),

                });


                if (
                    !continueOnError
                ) {

                    break;

                }

            }

        }


        const completedAt =
            new Date();


        const success =
            results.length ===
                normalizedExecutions.length &&
            results.every(
                execution =>
                    execution.success,
            );


        return {

            success,

            executions:
                results,

            startedAt,

            completedAt,

            message:
                success
                    ? undefined
                    : "One or more automation executions failed.",

        };

    }


    async executeOne(
        execution:
            AutomationExecutionInput,
    ): Promise<AutomationExecution> {


        const results =
            await this.execute(

                [
                    execution,
                ],

                {
                    continueOnError:
                        false,
                },

            );


        const result =
            results.executions[0];


        if (!result) {

            throw new Error(
                "Automation execution did not produce a result.",
            );

        }


        return result;

    }


    private validateExecutions(
        executions:
            AutomationExecutionInput[],
    ): AutomationExecutionInput[] {


        if (
            !Array.isArray(
                executions,
            )
        ) {

            throw new Error(
                "Automation executions must be an array.",
            );

        }


        return executions.map(
            (
                execution,
                index,
            ) => {


                if (
                    !execution ||
                    typeof execution !==
                        "object"
                ) {

                    throw new Error(
                        `Automation execution at index ${index} is required.`,
                    );

                }


                const workflowId =
                    typeof execution.workflowId ===
                        "string"
                        ? execution.workflowId.trim()
                        : "";


                const actionId =
                    typeof execution.actionId ===
                        "string"
                        ? execution.actionId.trim()
                        : "";


                if (!workflowId) {

                    throw new Error(
                        `Automation workflow id is required at index ${index}.`,
                    );

                }


                if (!actionId) {

                    throw new Error(
                        `Automation action id is required at index ${index}.`,
                    );

                }


                if (
                    typeof execution.execute !==
                    "function"
                ) {

                    throw new Error(
                        `Automation executor is required at index ${index}.`,
                    );

                }


                return {

                    ...execution,

                    workflowId,

                    actionId,

                };

            },
        );

    }


    private getErrorMessage(
        error: unknown,
    ): string {


        if (
            error instanceof Error
        ) {

            return error.message;

        }


        if (
            typeof error ===
            "string"
        ) {

            return error;

        }


        return "Automation execution failed.";

    }


    private getErrorCode(
        error: unknown,
    ): string | undefined {


        if (
            !error ||
            typeof error !==
                "object"
        ) {

            return undefined;

        }


        const candidate =
            (
                error as {
                    code?: unknown;
                }
            ).code;


        return typeof candidate ===
            "string" &&
            candidate.trim()
            ? candidate.trim()
            : undefined;

    }

}


export const automationService =
    new AutomationService();
