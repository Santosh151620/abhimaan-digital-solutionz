export interface AutomationExecution {

    workflowId: string;

    actionId: string;

    success: boolean;

    message?: string;

    startedAt: Date;

    completedAt?: Date;

    errorCode?: string;

    metadata?: Record<string, unknown>;

}


export interface AutomationResult {

    success: boolean;

    executions: AutomationExecution[];

    startedAt?: Date;

    completedAt?: Date;

    message?: string;

}