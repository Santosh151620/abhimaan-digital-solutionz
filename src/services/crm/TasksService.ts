import {
    createClient,
} from '@/lib/supabase/server';


import {
    createTasksRepository,
} from '@/repositories/crm/TasksRepository';


import type {
    Task,
    TaskSearchFilters,
    TaskStatus,
    TaskSummary,
} from '@/types/crm/Tasks';




class TasksService {



    private async repository() {


        const supabase =
            await createClient();



        return createTasksRepository(
            supabase,
        );


    }





    async list(): Promise<Task[]> {


        const repo =
            await this.repository();



        return repo.list();


    }






    async listArchived(): Promise<Task[]> {


        const repo =
            await this.repository();



        return repo.listArchived();


    }






    async findById(
        id: string,
    ): Promise<Task | null> {


        const repo =
            await this.repository();



        return repo.findById(
            id,
        );


    }






    async details(
        id: string,
    ): Promise<Task | null> {


        return this.findById(
            id,
        );


    }






    async search(
        filters?: TaskSearchFilters,
    ): Promise<Task[]> {


        const repo =
            await this.repository();



        return repo.search(
            filters,
        );


    }






    async create(
        data: Partial<Task>,
    ): Promise<Task> {


        const repo =
            await this.repository();



        return repo.create(
            data,
        );


    }






    async update(
        id: string,
        data: Partial<Task>,
    ): Promise<Task> {


        const repo =
            await this.repository();



        return repo.update(
            id,
            data,
        );


    }






    async updateStatus(
        id: string,
        status: TaskStatus,
    ): Promise<Task> {


        const repo =
            await this.repository();



        return repo.updateStatus(
            id,
            status,
        );


    }






    async delete(
        id: string,
    ): Promise<boolean> {


        const repo =
            await this.repository();



        await repo.delete(
            id,
        );


        return true;


    }






    async restore(
        id: string,
    ): Promise<boolean> {


        const repo =
            await this.repository();



        return repo.restore(
            id,
        );


    }






    async summary(): Promise<TaskSummary> {


        const repo =
            await this.repository();



        return repo.summary();


    }



}






export const tasksService =
    new TasksService();






/**
 * Production export
 */
export const TasksServiceInstance =
    tasksService;