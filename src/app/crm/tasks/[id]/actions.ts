'use server';

import {
    TasksServiceInstance,
} from '@/services/crm/TasksService';


export async function getTaskDetails(
    id: string
) {

    return TasksServiceInstance.details(
        id
    );

}


export async function updateTaskDetails(
    id: string,
    data: any
) {

    return TasksServiceInstance.update(
        id,
        data
    );

}


export async function changeTaskStatus(
    id: string,
    status: any
) {

    return TasksServiceInstance.updateStatus(
        id,
        status
    );

}