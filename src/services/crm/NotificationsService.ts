import {
    createNotificationsRepository,
} from '@/repositories/crm/NotificationsRepository';

import type {
    SupabaseClient,
} from '@supabase/supabase-js';

import type {
    Notification,
    NotificationSearchFilters,
    NotificationStatus,
    NotificationSummary,
} from '@/types/crm/Notifications';


class NotificationsService {


    private readonly repository;


    constructor(
    private readonly supabase: SupabaseClient,
) {

    this.repository =
        createNotificationsRepository(
            supabase,
        );

}


    async list(): Promise<Notification[]> {

        return this.repository.list();

    }


    async listArchived(): Promise<Notification[]> {

        return this.repository.listArchived();

    }


    async details(
        id: string,
    ): Promise<Notification | null> {

        return this.repository.details(
            id,
        );

    }


    async findById(
        id: string,
    ): Promise<Notification | null> {

        return this.repository.findById(
            id,
        );

    }


    async search(
        filters?: NotificationSearchFilters,
    ): Promise<Notification[]> {

        return this.repository.search(
            filters,
        );

    }


    async create(
        data: Partial<Notification>,
    ): Promise<Notification> {

        return this.repository.create(
            data,
        );

    }


    async update(
        id: string,
        data: Partial<Notification>,
    ): Promise<Notification | null> {

        return this.repository.update(
            id,
            data,
        );

    }


    async updateStatus(
        id: string,
        status: NotificationStatus,
    ): Promise<Notification | null> {

        return this.repository.updateStatus(
            id,
            status,
        );

    }


    async markAsRead(
        id: string,
    ): Promise<Notification | null> {

        return this.repository.updateStatus(
            id,
            'Read',
        );

    }


    async archive(
        id: string,
    ): Promise<boolean> {

        return this.repository.delete(
            id,
        )
        .then(
            () => true,
        );

    }


    async delete(
        id: string,
    ): Promise<boolean> {

        return this.archive(
            id,
        );

    }


    async restore(
        id: string,
    ): Promise<boolean> {

        return this.repository.restore(
            id,
        );

    }


    async summary(): Promise<NotificationSummary> {

        return this.repository.summary();

    }


}
/** * Backward compatibility export.
 * * Existing API routes/components consume * NotificationServiceInstance.
 * * New CRM architecture uses: * NotificationsServiceInstance
 */
export function createNotificationsService(
    supabase: SupabaseClient,
) {

    return new NotificationsService(
        supabase,
    );

}
