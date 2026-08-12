'use server';

import { TasksServiceInstance } from '@/services/crm/TasksService';


import type {
    Task,
    TaskStatus,
} from '@/types/crm/Tasks';

export async function getTaskDetails(
    id: string,
) {

    return TasksServiceInstance.findById(
        id,
    );

}

export async function updateTaskDetails(
    id: string,
    data: Partial<Task>,
) {

    return await TasksServiceInstance.update(
        id,
        data,
    );

}

async function changeTaskStatus(
    id: string,
    status: TaskStatus,
) {

    return await TasksServiceInstance.updateStatus(
        id,
        status,
    );

}