/**
 * ============================================================================
 * ADS WORKFLOW AUTOMATION SERVICE
 * ============================================================================
 *
 * Canonical execution boundary for workflow automation actions.
 *
 * Responsibilities:
 *
 * - Validate automation execution requests.
 * - Execute actions in deterministic order.
 * - Capture per-action execution results.
 * - Support fail-fast and continue-on-error execution modes.
 * - Normalize unknown errors into stable result information.
 * - Provide a single-execution convenience API.
 *
 * IMPORTANT:
 *
 * This service orchestrates execution only.
 *
 * It does NOT:
 *
 * - resolve tenant context;
 * - bypass authorization;
 * - access Supabase directly;
 * - persist workflow definitions;
 * - implement individual automation actions.
 *
 * Individual actions remain responsible for their own business rules and
 * authorization requirements.
 * ============================================================================
 */

import type {
    AutomationExecution,
    AutomationResult,
} from "@/types/workflow/Automation";



/**
 * Input contract for one automation action.
 */
export interface AutomationExecutionInput {

    readonly workflowId: string;

    readonly actionId: string;

    readonly execute:
        () => Promise<void>;

}



/**
 * Execution behavior options.
 */
export interface AutomationExecutionOptions {

    /**
     * Continue executing remaining actions after an action fails.
     *
     * Defaults to true so independent automation actions do not unnecessarily
     * prevent one another from completing.
     */
    readonly continueOnError?: boolean;

}



/**
 * Canonical workflow automation orchestration service.
 */
export class AutomationService {


    /**
     * Execute a collection of automation actions sequentially.
     *
     * Each action receives an independent result entry.
     *
     * When `continueOnError` is false, execution stops after the first failure.
     */
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


        const continueOnError =
            options.continueOnError ??
            true;


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

                results.push({

                    workflowId:
                        execution.workflowId,

                    actionId:
                        execution.actionId,

                    success:
                        false,

                    message:
                        this.getErrorMessage(
                            error,
                        ),

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


        /*
         * If fail-fast execution stopped before all actions were attempted,
         * the overall execution is necessarily unsuccessful.
         */
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



    /**
     * Execute exactly one automation action.
     *
     * Uses fail-fast semantics because there are no subsequent actions to
     * continue with.
     */
    async executeOne(
        execution:
            AutomationExecutionInput,
    ): Promise<AutomationExecution> {


        const result =
            await this.execute(

                [
                    execution,
                ],

                {
                    continueOnError:
                        false,
                },

            );


        const executionResult =
            result.executions[0];


        if (!executionResult) {

            throw new Error(
                "Automation execution did not produce a result.",
            );

        }


        return executionResult;

    }



    /**
     * Validate and normalize an automation execution collection.
     *
     * IDs are trimmed once at the service boundary so downstream actions
     * receive canonical identifiers.
     */
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


                if (
                    !workflowId
                ) {

                    throw new Error(
                        `Automation workflow id is required at index ${index}.`,
                    );

                }


                if (
                    !actionId
                ) {

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



    /**
     * Normalize an unknown thrown value into a safe user/service message.
     */
    private getErrorMessage(
        error: unknown,
    ): string {


        if (
            error instanceof Error
        ) {

            return (
                error.message.trim() ||
                "Automation execution failed."
            );

        }


        if (
            typeof error ===
            "string"
        ) {

            return (
                error.trim() ||
                "Automation execution failed."
            );

        }


        return "Automation execution failed.";

    }



    /**
     * Extract an optional machine-readable error code.
     */
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


        if (
            typeof candidate !==
            "string"
        ) {

            return undefined;

        }


        const code =
            candidate.trim();


        return code ||
            undefined;

    }

}



/**
 * Canonical application-wide automation service instance.
 */
export const automationService =
    new AutomationService();