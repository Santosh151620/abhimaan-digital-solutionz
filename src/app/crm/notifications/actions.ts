'use server';


import {

    revalidatePath,

} from 'next/cache';



import {

    notificationService,

} from '@/services/crm/NotificationService';





export async function getNotifications() {


    return notificationService.list();


}





export async function createNotification(

    data: {

        title: string;

        message: string;

        type: 'Info' | 'Success' | 'Warning' | 'Error';

        priority: 'Low' | 'Medium' | 'High';

        entityType?: string;

        entityId?: string;

    },

) {


    const notification =

        await notificationService.create({

            title: data.title,

            message: data.message,

            type: data.type,

            priority: data.priority,

            entityType: data.entityType,

            entityId: data.entityId,

            read: false,

        });



    revalidatePath(

        '/crm/notifications',

    );



    return notification;


}





export async function markNotificationRead(

    id: string,

) {


    const notification =

        await notificationService.update(

            id,

            {

                read: true,

            },

        );



    revalidatePath(

        '/crm/notifications',

    );



    return notification;


}





export async function updateNotification(

    id: string,

    data: {

        title?: string;

        message?: string;

    },

) {


    const notification =

        await notificationService.update(

            id,

            data,

        );



    revalidatePath(

        `/crm/notifications/${id}`,

    );



    revalidatePath(

        '/crm/notifications',

    );



    return notification;


}





export async function deleteNotification(

    id: string,

) {


    const result =

        await notificationService.delete(

            id,

        );



    revalidatePath(

        '/crm/notifications',

    );



    return result;


}