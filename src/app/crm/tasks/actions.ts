'use server';

import {
    TasksServiceInstance,
} from '@/services/crm/TasksService';

import type {
    Task,
    TaskStatus,
} from '@/types/crm/Tasks';

export async function getTasks() {
    return TasksServiceInstance.list();
}

export async function getArchivedTasks() {
    return TasksServiceInstance.listArchived();
}

export async function getTask(
    id: string
) {
    return TasksServiceInstance.details(
        id
    );
}

export async function createTask(
    data: Partial<Task>
) {
    return TasksServiceInstance.create(
        data
    );
}

export async function updateTask(
    id: string,
    data: Partial<Task>
) {
    return TasksServiceInstance.update(
        id,
        data
    );
}

export async function deleteTask(
    id: string
) {
    return TasksServiceInstance.delete(
        id
    );
}

export async function restoreTask(
    id: string
) {
    return TasksServiceInstance.restore(
        id
    );
}

export async function updateTaskStatus(
    id: string,
    status: TaskStatus
) {
    return TasksServiceInstance.updateStatus(
        id,
        status
    );
}

export async function getTasksSummary() {
    return TasksServiceInstance.summary();
}