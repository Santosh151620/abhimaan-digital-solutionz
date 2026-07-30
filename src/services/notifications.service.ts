import type {
    Notification,
} from '@/types/crm/Notifications';

import type {
    SupabaseClient,
} from '@supabase/supabase-js';

import {
    createNotificationsRepository,
} from '@/repositories/crm/NotificationsRepository';



export class NotificationsService {


    private readonly repository:
        ReturnType<
            typeof createNotificationsRepository
        >;



    constructor(
        supabase: SupabaseClient,
    ) {

        this.repository =
            createNotificationsRepository(
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

