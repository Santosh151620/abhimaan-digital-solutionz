export interface AutomationExecution {

    workflowId: string;

    actionId: string;

    success: boolean;

    message?: string;

    startedAt: Date;

    completedAt?: Date;

}

export interface AutomationResult {

    success: boolean;

    executions: AutomationExecution[];

}
