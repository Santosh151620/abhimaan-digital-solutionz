'use server';


import {
    ActivityServiceInstance,
} from '@/services/crm/ActivityService';



export async function getTaskActivities(
    taskId:string
) {


    return ActivityServiceInstance.list(

        'Task',

        taskId

    );


}