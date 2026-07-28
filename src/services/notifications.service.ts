import type {
    Notification,
} from '@/types/crm/Notification';

import type {
    SupabaseClient,
} from '@supabase/supabase-js';

import {
    createNotificationRepository,
} from '@/repositories/notifications.repository';



export class NotificationsService {


    private readonly repository:
        ReturnType<
            typeof createNotificationRepository
        >;



    constructor(
        supabase: SupabaseClient,
    ) {

        this.repository =
            createNotificationRepository(
                supabase,
            );

    }



    async getByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Notification[]> {

        return this.repository.findByEntity(
            entityType,
            entityId,
        );

    }



    async create(
        notification: Partial<Notification>,
    ): Promise<Notification> {

        return this.repository.create(
            notification,
        );

    }



}



export function createNotificationsService(
    supabase: SupabaseClient,
) {

    return new NotificationsService(
        supabase,
    );

}