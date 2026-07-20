export type ProjectStatus =
    | 'Planning'
    | 'Active'
    | 'On Hold'
    | 'Completed'
    | 'Cancelled';

export interface Project {

    id: string;

    projectNumber: string;

    companyId: string;

    contractId?: string;

    customerName: string;

    name: string;

    description?: string;

    status: ProjectStatus;

    startDate: string;

    endDate: string;

    budget: number;

    currency: string;

    manager?: string;

    archived: boolean;

    createdAt: string;

    updatedAt: string;

}

export interface ProjectSummary {

    total: number;

    planning: number;

    active: number;

    onHold: number;

    completed: number;

    cancelled: number;

    totalBudget: number;

}