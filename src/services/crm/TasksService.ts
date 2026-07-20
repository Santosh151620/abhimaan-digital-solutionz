import {
    TasksRepositoryInstance,
} from '@/repositories/crm/TasksRepository';

import type {
    Task,
    TaskStatus,
} from '@/types/crm/Tasks';

class TasksService {

    list() {
        return TasksRepositoryInstance.list();
    }

    listArchived() {
        return TasksRepositoryInstance.listArchived();
    }

    findById(
        id: string
    ) {
        return TasksRepositoryInstance.findById(
            id
        );
    }

    details(
        id: string
    ) {
        return this.findById(id);
    }

    search(
        filters?: {
            status?: TaskStatus;
            priority?: Task['priority'];
            search?: string;
        }
    ) {
        return TasksRepositoryInstance.search(
            filters
        );
    }

    create(
        data: Partial<Task>
    ) {
        return TasksRepositoryInstance.create(
            data
        );
    }

    update(
        id: string,
        data: Partial<Task>
    ) {
        return TasksRepositoryInstance.update(
            id,
            data
        );
    }

    updateStatus(
        id: string,
        status: TaskStatus
    ) {
        return TasksRepositoryInstance.updateStatus(
            id,
            status
        );
    }

    delete(
        id: string
    ) {
        return TasksRepositoryInstance.delete(
            id
        );
    }

    restore(
        id: string
    ) {
        return TasksRepositoryInstance.restore(
            id
        );
    }

    summary() {
        return TasksRepositoryInstance.summary();
    }

}

export const
    TasksServiceInstance =
        new TasksService();