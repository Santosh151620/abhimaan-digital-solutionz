import {
    NotificationRepositoryInstance,
} from '@/repositories/crm/NotificationRepository';


import type {
    Notification,
    NotificationSummary,
} from '@/types/crm/Notification';



class NotificationService {



    async list(): Promise<Notification[]> {

        return NotificationRepositoryInstance.list();

    }




    async listArchived(): Promise<Notification[]> {

        return NotificationRepositoryInstance.listArchived();

    }




    async listUnread(): Promise<Notification[]> {

        return NotificationRepositoryInstance.listUnread();

    }




    async listByUser(
        userId: string,
    ): Promise<Notification[]> {

        return NotificationRepositoryInstance.listByUser(
            userId,
        );

    }




    async listByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Notification[]> {

        return NotificationRepositoryInstance.listByEntity(
            entityType,
            entityId,
        );

    }




    async details(
        id: string,
    ): Promise<Notification | null> {

        return NotificationRepositoryInstance.findById(
            id,
        );

    }
async getById(
        id: string,
    ): Promise<Notification | null> {

        return this.findById(
            id,
        );

    }



    async findById(
        id: string,
    ): Promise<Notification | null> {

        return this.details(
            id,
        );

    }




    async create(
        data: Partial<Notification>,
    ): Promise<Notification> {

        return NotificationRepositoryInstance.create(
            data,
        );

    }




    async update(
        id: string,
        data: Partial<Notification>,
    ): Promise<Notification | null> {

        return NotificationRepositoryInstance.update(
            id,
            data,
        );

    }




    async markAsRead(
        id: string,
    ): Promise<boolean> {

        return NotificationRepositoryInstance.markAsRead(
            id,
        );

    }




    async markAsUnread(
        id: string,
    ): Promise<boolean> {

        return NotificationRepositoryInstance.markAsUnread(
            id,
        );

    }




    async archive(
        id: string,
    ): Promise<boolean> {

        return NotificationRepositoryInstance.archive(
            id,
        );

    }




    async delete(
        id: string,
    ): Promise<boolean> {

        return NotificationRepositoryInstance.archive(
            id,
        );

    }




    async restore(
        id: string,
    ): Promise<boolean> {

        return NotificationRepositoryInstance.restore(
            id,
        );

    }




    async summary(): Promise<NotificationSummary> {

        return NotificationRepositoryInstance.summary();

    }


}



export const NotificationServiceInstance =
    new NotificationService();



/**
 * Backward compatibility export.
 *
 * Existing pages/actions currently consume
 * notificationService.
 *
 * New architecture should migrate to
 * NotificationServiceInstance.
 */
export const notificationService =
    NotificationServiceInstance;
