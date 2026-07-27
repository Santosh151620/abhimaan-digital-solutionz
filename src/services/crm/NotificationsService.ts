import {
    NotificationsRepositoryInstance,
} from '@/repositories/crm/NotificationsRepository';

import type {
    Notification,
    NotificationSearchFilters,
    NotificationStatus,
    NotificationSummary,
} from '@/types/crm/Notifications';

class NotificationsService {

    list(): Notification[] {

        return NotificationsRepositoryInstance.list();

    }

    listArchived(): Notification[] {

        return NotificationsRepositoryInstance.listArchived();

    }

    details(
        id: string,
    ): Notification | null {

        return NotificationsRepositoryInstance.details(
            id,
        );

    }

    findById(
        id: string,
    ): Notification | null {

        return NotificationsRepositoryInstance.findById(
            id,
        );

    }

    search(
        filters?: NotificationSearchFilters,
    ): Notification[] {

        return NotificationsRepositoryInstance.search(
            filters,
        );

    }

    create(
        data: Partial<Notification>,
    ): Notification {

        return NotificationsRepositoryInstance.create(
            data,
        );

    }

    update(
        id: string,
        data: Partial<Notification>,
    ): Notification | null {

        return NotificationsRepositoryInstance.update(
            id,
            data,
        );

    }

    updateStatus(
        id: string,
        status: NotificationStatus,
    ): Notification | null {

        return NotificationsRepositoryInstance.updateStatus(
            id,
            status,
        );

    }

    markAsRead(
        id: string,
    ): Notification | null {

        return this.updateStatus(
            id,
            'Read',
        );

    }

    archive(
        id: string,
    ): boolean {

        return NotificationsRepositoryInstance.delete(
            id,
        );

    }

    restore(
        id: string,
    ): boolean {

        return NotificationsRepositoryInstance.restore(
            id,
        );

    }

    delete(
        id: string,
    ): boolean {

        return this.archive(
            id,
        );

    }

    summary(): NotificationSummary {

        return NotificationsRepositoryInstance.summary();

    }

}

export const
    NotificationsServiceInstance =
        new NotificationsService();