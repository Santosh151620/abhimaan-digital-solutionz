import {
    TasksRepositoryInstance,
} from '@/repositories/crm/TasksRepository';

import type {
    Task,
    TaskSearchFilters,
    TaskStatus,
    TaskSummary,
} from '@/types/crm/Tasks';

class TasksService {

    list(): Task[] {

        return TasksRepositoryInstance.list();

    }

    listArchived(): Task[] {

        return TasksRepositoryInstance.listArchived();

    }

    findById(
        id: string,
    ): Task | null {

        return TasksRepositoryInstance.findById(
            id,
        );

    }

    details(
        id: string,
    ): Task | null {

        return this.findById(
            id,
        );

    }

    search(
        filters?: TaskSearchFilters,
    ): Task[] {

        return TasksRepositoryInstance.search(
            filters,
        );

    }

    create(
        data: Partial<Task>,
    ): Task {

        return TasksRepositoryInstance.create(
            data,
        );

    }

    update(
        id: string,
        data: Partial<Task>,
    ): Task | null {

        return TasksRepositoryInstance.update(
            id,
            data,
        );

    }

    updateStatus(
        id: string,
        status: TaskStatus,
    ): Task | null {

        return TasksRepositoryInstance.updateStatus(
            id,
            status,
        );

    }

    delete(
        id: string,
    ): boolean {

        return TasksRepositoryInstance.delete(
            id,
        );

    }

    restore(
        id: string,
    ): boolean {

        return TasksRepositoryInstance.restore(
            id,
        );

    }

    summary(): TaskSummary {

        return TasksRepositoryInstance.summary();

    }

}

export async function createTasksService(): Promise<TasksService> {

    return new TasksService();

}

export const TasksServiceInstance =
    new TasksService();