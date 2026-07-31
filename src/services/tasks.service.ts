import type { SupabaseClient } from "@supabase/supabase-js";

import {
    createTasksRepository,
} from "@/repositories/crm/TasksRepository";

import type {
    Task,
} from "@/types/crm/Tasks";


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



    async findByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Task[]> {

        const tasks =
            await this.repository.list();


        return tasks.filter(
            task =>
                task.entityType === entityType &&
                task.entityId === entityId,
        );

    }



    async create(
        task: Partial<Task>,
    ) {

        return this.repository.create(
            task,
        );

    }



    async update(
        id: string,
        task: Partial<Task>,
    ) {

        return this.repository.update(
            id,
            task,
        );

    }



    async delete(
        id: string,
    ) {

        return this.repository.delete(
            id,
        );

    }


}