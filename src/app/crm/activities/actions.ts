'use server';


import {
    ActivityServiceInstance,
} from '@/services/crm/ActivityService';


import type {
    Activity,
    ActivityStatus,
} from '@/types/crm/Activities';



async function getActivities() {


    return ActivityServiceInstance.list();


}




async function getArchivedActivities() {


    return ActivityServiceInstance.listArchived();


}




async function getActivity(

    id: string,

) {


    return ActivityServiceInstance.details(
        id,
    );


}




export async function createActivity(

    data: Partial<Activity>,

) {


    return ActivityServiceInstance.create(
        data,
    );


}




async function updateActivity(

    id: string,

    data: Partial<Activity>,

) {


    return ActivityServiceInstance.update(
        id,
        data,
    );


}




export async function deleteActivity(

    id: string,

) {


    return ActivityServiceInstance.delete(
        id,
    );


}




async function restoreActivity(

    id: string,

) {


    return ActivityServiceInstance.restore(
        id,
    );


}




async function updateActivityStatus(

    id: string,

    status: ActivityStatus,

) {


    return ActivityServiceInstance.updateStatus(
        id,
        status,
    );


}




async function getActivitySummary() {


    return ActivityServiceInstance.summary();


}

