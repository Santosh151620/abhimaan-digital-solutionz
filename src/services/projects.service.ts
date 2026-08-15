import type {
    SupabaseClient,
} from "@supabase/supabase-js";

import {
    ProjectsRepository,
} from "@/repositories/crm/ProjectsRepository";

import type {
    Project,
    ProjectStatus,
} from "@/types/crm/Projects";


/**
 * ============================================================================
 * PROJECTS SERVICE
 * ============================================================================
 *
 * CRM application-service boundary for project operations.
 *
 * Responsibilities:
 *
 * - Validate service-level identifiers and inputs.
 * - Delegate persistence and queries to ProjectsRepository.
 * - Preserve the existing repository dependency-injection model.
 * - Keep project business orchestration above the persistence layer.
 *
 * IMPORTANT:
 *
 * This service does NOT:
 *
 * - access Supabase tables directly
 * - implement tenant context independently
 * - bypass ProjectsRepository
 * - duplicate repository persistence logic
 * - replace database/RLS authorization
 *
 * ProjectsRepository remains responsible for persistence and the underlying
 * tenant/security boundary.
 * ============================================================================
 */


/**
 * Validate a required project identifier.
 */
function requireProjectId(
    id: string,
): string {

    if (
        typeof id !== "string"
    ) {

        throw new TypeError(
            "ProjectsService: project id must be a string.",
        );

    }


    const normalized =
        id.trim();


    if (
        normalized.length === 0
    ) {

        throw new Error(
            "ProjectsService: project id is required.",
        );

    }


    return normalized;

}


/**
 * Validate a required project status.
 *
 * ProjectStatus is a domain type, so runtime validation intentionally remains
 * lightweight. The repository/database remains the authoritative constraint
 * for persisted status values.
 */
function requireProjectStatus(
    status: ProjectStatus,
): ProjectStatus {

    if (
        typeof status !== "string" ||
        status.trim().length === 0
    ) {

        throw new Error(
            "ProjectsService: project status is required.",
        );

    }


    return status;

}


/**
 * Validate project payloads without altering the repository's established
 * Partial<Project> contract.
 */
function requireProjectData(
    data: Partial<Project>,
): Partial<Project> {

    if (
        !data ||
        typeof data !== "object"
    ) {

        throw new TypeError(
            "ProjectsService: project data is required.",
        );

    }


    return data;

}


export class ProjectsService {

    constructor(
        private readonly repository:
            ProjectsRepository,
    ) {

        if (!repository) {

            throw new Error(
                "ProjectsService: repository is required.",
            );

        }

    }


    /**
     * Return all active/non-archived projects according to the repository
     * contract.
     */
    async list(): Promise<Project[]> {

        return this.repository.findAll();

    }


    /**
     * Return archived projects according to the repository contract.
     */
    async listArchived(): Promise<Project[]> {

        return this.repository.listArchived();

    }


    /**
     * Return a project by identifier.
     */
    async details(
        id: string,
    ): Promise<Project | null> {

        const projectId =
            requireProjectId(id);


        return this.repository.findById(
            projectId,
        );

    }


    /**
     * Create a project through the repository boundary.
     */
    async create(
        data: Partial<Project>,
    ): Promise<Project> {

        const projectData =
            requireProjectData(data);


        return this.repository.create(
            projectData,
        );

    }


    /**
     * Update a project through the repository boundary.
     */
    async update(
        id: string,
        data: Partial<Project>,
    ): Promise<Project> {

        const projectId =
            requireProjectId(id);

        const projectData =
            requireProjectData(data);


        return this.repository.update(
            projectId,
            projectData,
        );

    }


    /**
     * Update only the project status.
     *
     * Kept as a dedicated application operation because status transitions
     * are a meaningful domain action and existing consumers already depend
     * upon this method.
     */
    async updateStatus(
        id: string,
        status: ProjectStatus,
    ): Promise<Project> {

        const projectId =
            requireProjectId(id);

        const projectStatus =
            requireProjectStatus(status);


        return this.repository.update(
            projectId,
            {
                status:
                    projectStatus,
            },
        );

    }


    /**
     * Delete a project through the canonical repository boundary.
     *
     * The return type remains void to preserve the existing service contract.
     */
    async delete(
        id: string,
    ): Promise<void> {

        const projectId =
            requireProjectId(id);


        await this.repository.delete(
            projectId,
        );

    }


    /**
     * Return the repository's canonical project summary.
     *
     * The return type is intentionally inferred so this service remains
     * aligned automatically with the existing repository contract.
     */
    async summary() {

        return this.repository.summary();

    }

}


/**
 * ============================================================================
 * SERVICE FACTORY
 * ============================================================================
 *
 * Existing dependency-injection entry point preserved.
 */
export function createProjectsService(
    supabase: SupabaseClient,
): ProjectsService {

    if (!supabase) {

        throw new Error(
            "ProjectsService: Supabase client is required.",
        );

    }


    return new ProjectsService(
        new ProjectsRepository(
            supabase,
        ),
    );

}