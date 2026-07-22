import {
    NotificationsRepository,
} from '@/repositories/notifications.repository';

import type {
    Notification,
} from '@/types/notifications';

export class NotificationService {

    constructor(
        private readonly repository: NotificationsRepository,
    ) {}

    findByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Notification[]> {

        return this.repository.findByEntity(
            entityType,
            entityId,
        );

    }

}

export default NotificationService;