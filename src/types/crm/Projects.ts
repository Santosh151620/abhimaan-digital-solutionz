export type ProjectStatus =
    | 'Planning'
    | 'Active'
    | 'On Hold'
    | 'Completed'
    | 'Cancelled';

export interface Project {

    id: string;
    projectNumber: string;
    companyId?: string;
    contactId?: string;
    opportunityId?: string;
    contractId?: string;
    customerName?: string;
    name: string;
    description?: string;
    status: ProjectStatus;
    projectType?: string;
    priority?: string;
    ownerUserId?: string;
    manager?: string;
    startDate?: string;
    endDate?: string;
    actualEndDate?: string;
    budget: number;
    actualCost?: number;
    currency?: string;
    metadata?: Record<string, unknown>;
    progressPercent?: number;
    archived?: boolean;
    createdAt: string;
    updatedAt: string;

}

interface ProjectSearchFilters {

    search?: string;

    companyId?: string;

    status?: ProjectStatus;

    manager?: string;

}

interface ProjectSummary {

    total: number;

    planning: number;

    active: number;

    onHold: number;

    completed: number;

    cancelled: number;

    archived: number;

    totalBudget: number;

    totalActualCost: number;

}
