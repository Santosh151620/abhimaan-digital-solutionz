'use server';

import {
    TasksServiceInstance,
} from '@/services/crm/TasksService';

import type {
    Task,
    TaskStatus,
} from '@/types/crm/Tasks';

export async function getTaskDetails(
    id: string,
) {

    return TasksServiceInstance.details(
        id,
    );

}

export async function updateTaskDetails(
    id: string,
    data: Partial<Task>,
) {

    return TasksServiceInstance.update(
        id,
        data,
    );

}

export async function changeTaskStatus(
    id: string,
    status: TaskStatus,
) {

    return TasksServiceInstance.updateStatus(
        id,
        status,
    );

}