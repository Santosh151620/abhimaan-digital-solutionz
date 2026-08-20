import type {
    Project as CRMProject,
    ProjectStatus,
} from "@/types/crm/Projects";


export type Project =
    CRMProject;


export type {
    ProjectStatus,
};


/**
 * Project priority follows the canonical CRM Project contract.
 *
 * The canonical model currently defines priority as string.
 * Do not narrow this here without a corresponding DB/domain
 * contract change.
 */
export type ProjectPriority =
    NonNullable<CRMProject["priority"]>;


export interface ProjectFilters {

    search?: string;

    status?:
        | ProjectStatus
        | "All";

    companyId?: string;

    contractId?: string;

    projectType?: string;

    priority?: ProjectPriority;

    page?: number;

    pageSize?: number;

}


export interface PaginatedProjects {

    projects: Project[];

    total: number;

    page: number;

    pageSize: number;

    totalPages: number;

}


export type ProjectCreateInput =
    Partial<Project>;


export type ProjectUpdateInput =
    Partial<Project>;


export interface ProjectListResponse {

    projects: Project[];

    total: number;

    page: number;

    pageSize: number;

    totalPages: number;

}


export interface ProjectKPI {

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