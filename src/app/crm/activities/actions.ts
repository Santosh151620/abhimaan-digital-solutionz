'use server';


import {
    ActivityServiceInstance,
} from '@/services/crm/ActivityService';


import type {
    Activity,
    ActivityStatus,
} from '@/types/crm/Activity';



export async function getActivities() {


    return ActivityServiceInstance.list();


}




export async function getArchivedActivities() {


    return ActivityServiceInstance.listArchived();


}




export async function getActivity(

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




export async function updateActivity(

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




export async function restoreActivity(

    id: string,

) {


    return ActivityServiceInstance.restore(
        id,
    );


}




export async function updateActivityStatus(

    id: string,

    status: ActivityStatus,

) {


    return ActivityServiceInstance.updateStatus(
        id,
        status,
    );


}




export async function getActivitySummary() {


    return ActivityServiceInstance.summary();


}