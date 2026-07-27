'use server';


import {
    TasksServiceInstance,
} from '@/services/crm/TasksService';


import {
    PermissionServiceInstance,
} from '@/services/crm/PermissionService';


import {
    CRM_ADMIN_ROLE,
} from '@/shared/crmPermissions';


import type {
    Task,
    TaskStatus,
} from '@/types/crm/Tasks';



function can(
    action:
        | 'create'
        | 'update'
        | 'delete'
) {

    return PermissionServiceInstance.hasPermission(

        CRM_ADMIN_ROLE,

        'Task',

        action

    );

}



export async function getTasks() {

    return await await TasksServiceInstance.list();

}



export async function searchTasks(
    filters?: {

        status?: TaskStatus;

        priority?: Task['priority'];

        search?: string;

    }
) {

    return TasksServiceInstance.search(
        filters
    );

}



export async function getArchivedTasks() {

    return await await TasksServiceInstance.listArchived();

}



export async function getTask(
    id:string
) {

    return TasksServiceInstance.findById(
        id
    );

}



export async function createTask(
    data:Partial<Task>
) {


    if (
        !can('create')
    ) {

        throw new Error(
            'Permission denied'
        );

    }



    return await await TasksServiceInstance.create(
        data
    );

}



export async function updateTask(
    id:string,
    data:Partial<Task>
) {


    if (
        !can('update')
    ) {

        throw new Error(
            'Permission denied'
        );

    }



    return await await TasksServiceInstance.update(
        id,
        data
    );

}



export async function deleteTask(
    id:string
) {


    if (
        !can('delete')
    ) {

        throw new Error(
            'Permission denied'
        );

    }



    return await await TasksServiceInstance.delete(
        id
    );

}



export async function restoreTask(
    id:string
) {


    if (
        !can('update')
    ) {

        throw new Error(
            'Permission denied'
        );

    }



    return await await TasksServiceInstance.restore(
        id
    );

}



export async function updateTaskStatus(
    id:string,
    status:TaskStatus
) {


    if (
        !can('update')
    ) {

        throw new Error(
            'Permission denied'
        );

    }



    return await await TasksServiceInstance.updateStatus(
        id,
        status
    );

}



export async function getTasksSummary() {

    return await await TasksServiceInstance.summary();

}


