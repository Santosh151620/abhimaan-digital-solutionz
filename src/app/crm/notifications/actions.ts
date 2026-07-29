'use server';

import type {
    NotificationPriority,
    NotificationType,
} from '@/types/crm/Notifications';

import {
    revalidatePath,
} from 'next/cache';

import {
    createClient,
} from '@/lib/supabase/server';

import {
    createNotificationsService,
} from '@/services/crm/NotificationsService';

async function getNotificationService() {

    const supabase =
        await createClient();


    return createNotificationsService(
        supabase,
    );

}





export async function getNotifications() {

    const service =
        await getNotificationService();


    return service.list();

}





export async function createNotification(

    data: {

        title: string;

        message: string;

        type: NotificationType;

        priority: NotificationPriority;

        entityType?: string;

        entityId?: string;

    },

) {


    const service =
        await getNotificationService();



    const notification =
        await service.create({

            title:
                data.title,

            message:
                data.message,

            type:
                data.type,

            priority:
                data.priority,

            entityType:
                data.entityType,

            entityId:
                data.entityId,

        });



    revalidatePath(
        '/crm/notifications',
    );


    return notification;

}





export async function markNotificationRead(

    id: string,

) {


    const service =
        await getNotificationService();



    const notification =
        await service.updateStatus(

            id,

            'Read',

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


    const service =
        await getNotificationService();



    const notification =
        await service.update(

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


    const service =
        await getNotificationService();



    const result =
        await service.delete(
            id,
        );



    revalidatePath(
        '/crm/notifications',
    );


    return result;

}
