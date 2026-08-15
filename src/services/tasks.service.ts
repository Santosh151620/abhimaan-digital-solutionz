import type {
    SupabaseClient,
} from "@supabase/supabase-js";

import {
    createTasksRepository,
} from "@/repositories/crm/TasksRepository";

import type {
    Task,
} from "@/types/crm/Tasks";


/**
 * ============================================================================
 * CRM TASKS SERVICE
 * ============================================================================
 *
 * Application service boundary for CRM task operations.
 *
 * Responsibilities:
 *
 * - Expose the task use-case contract to callers.
 * - Keep repository access behind the service boundary.
 * - Preserve the existing repository implementation.
 * - Provide entity-scoped task lookup.
 * - Avoid leaking Supabase/database concerns into consumers.
 *
 * The repository remains responsible for persistence and RLS enforcement.
 * ============================================================================ 
 */


export class TasksService {


    private readonly repository:
        ReturnType<
            typeof createTasksRepository
        >;


    constructor(
        supabase: SupabaseClient,
    ) {

        this.repository =
            createTasksRepository(
                supabase,
            );

    }


    /**
     * Return all tasks visible to the current
     * authenticated organization/context.
     */
    async list(): Promise<Task[]> {

        return this.repository.list();

    }


    /**
     * Find tasks associated with a specific entity.
     *
     * `entityType` intentionally remains a string at
     * the service boundary because callers may provide
     * entity references dynamically.
     *
     * The persisted Task contract currently defines
     * its own entityType as the literal "Task". We
     * therefore compare through a normalized string
     * representation rather than weakening the Task type
     * or introducing unsafe casts.
     */
    async findByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Task[]> {

        const normalizedEntityType =
            entityType.trim();

        const normalizedEntityId =
            entityId.trim();


        if (
            normalizedEntityType.length === 0 ||
            normalizedEntityId.length === 0
        ) {

            return [];

        }


        const tasks =
            await this.repository.list();


        return tasks.filter(
            (task) =>
                String(task.entityType) ===
                    normalizedEntityType &&
                task.entityId ===
                    normalizedEntityId,
        );

    }


    /**
     * Create a task.
     */
    async create(
        task: Partial<Task>,
    ): Promise<Task> {

        return this.repository.create(
            task,
        );

    }


    /**
     * Update an existing task.
     */
    async update(
        id: string,
        task: Partial<Task>,
    ): Promise<Task> {

        return this.repository.update(
            id,
            task,
        );

    }


    /**
     * Delete a task.
     *
     * Repository behavior determines whether this is
     * a hard delete or governed soft-delete operation.
     */
    async delete(
        id: string,
    ): Promise<void> {

        await this.repository.delete(
            id,
        );

    }

}


/**
 * Factory used by application/server boundaries
 * that already own the Supabase client.
 */
export function createTasksService(
    supabase: SupabaseClient,
): TasksService {

    return new TasksService(
        supabase,
    );

}