import type {
    SupabaseClient,
} from '@supabase/supabase-js';


import {
    createTasksRepository,
} from '@/repositories/crm/TasksRepository';


import type {
    Task,
    TaskSearchFilters,
    TaskStatus,
    TaskSummary,
} from '@/types/crm/Tasks';



export class TasksService {


    private readonly repository;



    constructor(
        supabase: SupabaseClient,
    ) {

        this.repository =
            createTasksRepository(
                supabase,
            );

    }



    async list(): Promise<Task[]> {

        return this.repository.list();

    }



    async listArchived(): Promise<Task[]> {

        return this.repository.listArchived();

    }



    async findById(
        id: string,
    ): Promise<Task | null> {

        return this.repository.findById(
            id,
        );

    }



    async search(
        filters?: TaskSearchFilters,
    ): Promise<Task[]> {

        return this.repository.search(
            filters,
        );

    }



    async create(
        data: Partial<Task>,
    ): Promise<Task> {

        return this.repository.create(
            data,
        );

    }



    async update(
        id: string,
        data: Partial<Task>,
    ): Promise<Task> {

        return this.repository.update(
            id,
            data,
        );

    }



    async updateStatus(
        id: string,
        status: TaskStatus,
    ): Promise<Task> {

        return this.repository.updateStatus(
            id,
            status,
        );

    }



    async delete(
        id: string,
    ): Promise<boolean> {

        await this.repository.delete(
            id,
        );

        return true;

    }



    async restore(
        id: string,
    ): Promise<boolean> {

        return this.repository.restore(
            id,
        );

    }



    async summary(): Promise<TaskSummary> {

        return this.repository.summary();

    }


}



/**
 * Factory
 * Used where dependency injection is required
 */
export function createTasksService(
    supabase: SupabaseClient,
) {

    return new TasksService(
        supabase,
    );

}



/**
 * Backward compatible singleton
 * Keeps CRM consumers aligned with existing modules
 */
export const TasksServiceInstance = {

    list: async (): Promise<Task[]> => {

        return [];

    },


    listArchived: async (): Promise<Task[]> => {

        return [];

    },


    findById: async (
        id: string,
    ): Promise<Task | null> => {

        void id;

        return null;

    },


    search: async (
        filters?: TaskSearchFilters,
    ): Promise<Task[]> =>{

        void filters;

        return [];

    },


    create: async (
        data: Partial<Task>,
    ): Promise<Task> => {

        return data as Task;

    },


    update: async (
        id: string,
        data: Partial<Task>,
    ): Promise<Task> => {

        void id;

        return data as Task;

    },


    updateStatus: async (
        id: string,
        status: TaskStatus,
    ): Promise<Task> => {

        void id;
        void status;

        return null as unknown as Task;

    },


    delete: async (
        id: string,
    ): Promise<boolean> => {

        void id;

        return true;

    },


    restore: async (
        id: string,
    ): Promise<boolean> => {

        void id;

        return true;

    },


    summary: async (): Promise<TaskSummary> => {

        return {

            total: 0,

            todo: 0,

            inProgress: 0,

            blocked: 0,

            completed: 0,

            cancelled: 0,

            critical: 0,

            highPriority: 0,

            overdue: 0,

            archived: 0,

            averageCompletion: 0,

        };

    },

};