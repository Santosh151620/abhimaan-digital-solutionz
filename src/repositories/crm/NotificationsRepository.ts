import type {
    Notification,
    NotificationSearchFilters,
    NotificationStatus,
    NotificationSummary,
} from '@/types/crm/Notifications';

export class NotificationsRepository {

    private readonly notifications =
        new Map<string, Notification>();

    list(): Notification[] {

        return [
            ...this.notifications.values(),
        ]
            .filter(
                notification =>
                    !notification.archived,
            )
            .sort(
                (a, b) =>
                    b.createdAt.localeCompare(
                        a.createdAt,
                    ),
            );

    }

    listArchived(): Notification[] {

        return [
            ...this.notifications.values(),
        ]
            .filter(
                notification =>
                    notification.archived,
            )
            .sort(
                (a, b) =>
                    b.updatedAt.localeCompare(
                        a.updatedAt,
                    ),
            );

    }

    details(
        id: string,
    ): Notification | null {

        return (
            this.notifications.get(id)
            ?? null
        );

    }

    findById(
        id: string,
    ): Notification | null {

        return this.details(
            id,
        );

    }

    search(
        filters?: NotificationSearchFilters,
    ): Notification[] {

        let notifications =
            this.list();

        if (filters?.status) {

            notifications =
                notifications.filter(
                    item =>
                        item.status ===
                        filters.status,
                );

        }

        if (filters?.priority) {

            notifications =
                notifications.filter(
                    item =>
                        item.priority ===
                        filters.priority,
                );

        }

        if (filters?.type) {

            notifications =
                notifications.filter(
                    item =>
                        item.type ===
                        filters.type,
                );

        }

        if (filters?.entityType) {

            notifications =
                notifications.filter(
                    item =>
                        item.entityType ===
                        filters.entityType,
                );

        }

        if (filters?.entityId) {

            notifications =
                notifications.filter(
                    item =>
                        item.entityId ===
                        filters.entityId,
                );

        }

        if (filters?.ownerId) {

            notifications =
                notifications.filter(
                    item =>
                        item.ownerId ===
                        filters.ownerId,
                );

        }

        if (filters?.userId) {

            notifications =
                notifications.filter(
                    item =>
                        item.userId ===
                        filters.userId,
                );

        }

        if (filters?.search) {

            const keyword =
                filters.search
                    .trim()
                    .toLowerCase();

            notifications =
                notifications.filter(
                    item =>

                        item.notificationNumber
                            .toLowerCase()
                            .includes(keyword)

                        ||

                        item.title
                            .toLowerCase()
                            .includes(keyword)

                        ||

                        item.message
                            .toLowerCase()
                            .includes(keyword),

                );

        }

        return notifications;

    }

    create(
        data: Partial<Notification>,
    ): Notification {

        const now =
            new Date()
                .toISOString();

        const notification: Notification = {

            id:
                data.id ??
                crypto.randomUUID(),

            notificationNumber:
                data.notificationNumber ??
                `NTF-${Date.now()}`,

            organizationId:
                data.organizationId,

            entityType:
                data.entityType,

            entityId:
                data.entityId,

            ownerId:
                data.ownerId,

            userId:
                data.userId,

            title:
                data.title ?? '',

            message:
                data.message ?? '',

            type:
                data.type ??
                'System',

            priority:
                data.priority ??
                'Medium',

            status:
                data.status ??
                'Unread',

            actionUrl:
                data.actionUrl,

            actionLabel:
                data.actionLabel,

            icon:
                data.icon,

            metadata:
                data.metadata,

            readAt:
                data.readAt,

            archived: false,

            createdAt: now,

            updatedAt: now,

        };

        this.notifications.set(
            notification.id,
            notification,
        );

        return notification;

    }

    update(
        id: string,
        data: Partial<Notification>,
    ): Notification | null {

        const existing =
            this.notifications.get(id);

        if (!existing) {

            return null;

        }

        const updated: Notification = {

            ...existing,

            ...data,

            updatedAt:
                new Date()
                    .toISOString(),

        };

        this.notifications.set(
            id,
            updated,
        );

        return updated;

    }

    updateStatus(
        id: string,
        status: NotificationStatus,
    ): Notification | null {

        const update: Partial<Notification> = {

            status,

        };

        if (status === 'Read') {

            update.readAt =
                new Date()
                    .toISOString();

        }

        return this.update(
            id,
            update,
        );

    }

    delete(
        id: string,
    ): boolean {

        const existing =
            this.notifications.get(id);

        if (!existing) {

            return false;

        }

        existing.archived = true;

        existing.updatedAt =
            new Date()
                .toISOString();

        this.notifications.set(
            id,
            existing,
        );

        return true;

    }

    restore(
        id: string,
    ): boolean {

        const existing =
            this.notifications.get(id);

        if (!existing) {

            return false;

        }

        existing.archived = false;

        existing.updatedAt =
            new Date()
                .toISOString();

        this.notifications.set(
            id,
            existing,
        );

        return true;

    }

    summary(): NotificationSummary {

        const notifications =
            this.list();

        const archived =
            this.listArchived();

        return {

            total:
                notifications.length,

            unread:
                notifications.filter(
                    n =>
                        n.status ===
                        'Unread',
                ).length,

            read:
                notifications.filter(
                    n =>
                        n.status ===
                        'Read',
                ).length,

            archived:
                archived.length,

            lowPriority:
                notifications.filter(
                    n =>
                        n.priority ===
                        'Low',
                ).length,

            mediumPriority:
                notifications.filter(
                    n =>
                        n.priority ===
                        'Medium',
                ).length,

            highPriority:
                notifications.filter(
                    n =>
                        n.priority ===
                        'High',
                ).length,

            criticalPriority:
                notifications.filter(
                    n =>
                        n.priority ===
                        'Critical',
                ).length,

        };

    }

}

export const
    NotificationsRepositoryInstance =
        new NotificationsRepository();