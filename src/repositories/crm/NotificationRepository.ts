import type {
    Notification,
    NotificationSummary,
} from '@/types/crm/Notification';

class NotificationRepository {

    private notifications =
        new Map<string, Notification>();

    async list(): Promise<Notification[]> {

        return Array.from(
            this.notifications.values(),
        ).filter(
            notification =>
                !notification.archived,
        );

    }

    async listArchived(): Promise<Notification[]> {

        return Array.from(
            this.notifications.values(),
        ).filter(
            notification =>
                notification.archived,
        );

    }

    async listUnread(): Promise<Notification[]> {

        return (
            await this.list()
        ).filter(
            notification =>
                !notification.read,
        );

    }

    async listByUser(
        userId: string,
    ): Promise<Notification[]> {

        return (
            await this.list()
        ).filter(
            notification =>
                notification.userId === userId,
        );

    }

    async listByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Notification[]> {

        return (
            await this.list()
        ).filter(
            notification =>

                notification.entityType === entityType

                &&

                notification.entityId === entityId,
        );

    }

    async findById(
        id: string,
    ): Promise<Notification | null> {

        return (
            this.notifications.get(id)
            ??
            null
        );

    }

    async create(
        data: Partial<Notification>,
    ): Promise<Notification> {

        const now =
            new Date().toISOString();

        const notification: Notification = {

            id:
                crypto.randomUUID(),

            organizationId:
                data.organizationId,

            userId:
                data.userId,

            entityType:
                data.entityType,

            entityId:
                data.entityId,

            title:
                data.title ?? '',

            message:
                data.message ?? '',

            type:
                data.type ?? 'Info',

            priority:
                data.priority ?? 'Medium',

            read:
                false,

            archived:
                false,

            readAt:
                undefined,

            createdAt:
                now,

            updatedAt:
                now,

        };

        this.notifications.set(
            notification.id,
            notification,
        );

        return notification;

    }

    async update(
        id: string,
        data: Partial<Notification>,
    ): Promise<Notification | null> {

        const existing =
            this.notifications.get(id);

        if (!existing) {

            return null;

        }

        const updated: Notification = {

            ...existing,

            ...data,

            updatedAt:
                new Date().toISOString(),

        };

        this.notifications.set(
            id,
            updated,
        );

        return updated;

    }

    async markAsRead(
        id: string,
    ): Promise<boolean> {

        const notification =
            this.notifications.get(id);

        if (!notification) {

            return false;

        }

        notification.read = true;

        notification.readAt =
            new Date().toISOString();

        notification.updatedAt =
            notification.readAt;

        this.notifications.set(
            id,
            notification,
        );

        return true;

    }

    async markAsUnread(
        id: string,
    ): Promise<boolean> {

        const notification =
            this.notifications.get(id);

        if (!notification) {

            return false;

        }

        notification.read = false;

        notification.readAt =
            undefined;

        notification.updatedAt =
            new Date().toISOString();

        this.notifications.set(
            id,
            notification,
        );

        return true;

    }

    async archive(
        id: string,
    ): Promise<boolean> {

        const notification =
            this.notifications.get(id);

        if (!notification) {

            return false;

        }

        notification.archived = true;

        notification.updatedAt =
            new Date().toISOString();

        this.notifications.set(
            id,
            notification,
        );

        return true;

    }

    async restore(
        id: string,
    ): Promise<boolean> {

        const notification =
            this.notifications.get(id);

        if (!notification) {

            return false;

        }

        notification.archived = false;

        notification.updatedAt =
            new Date().toISOString();

        this.notifications.set(
            id,
            notification,
        );

        return true;

    }

    async summary(): Promise<NotificationSummary> {

        const notifications =
            Array.from(
                this.notifications.values(),
            );

        const active =
            notifications.filter(
                notification =>
                    !notification.archived,
            );

        return {

            total:
                active.length,

            unread:
                active.filter(
                    notification =>
                        !notification.read,
                ).length,

            read:
                active.filter(
                    notification =>
                        notification.read,
                ).length,

            highPriority:
                active.filter(
                    notification =>
                        notification.priority === 'High',
                ).length,

            warning:
                active.filter(
                    notification =>
                        notification.type === 'Warning',
                ).length,

            error:
                active.filter(
                    notification =>
                        notification.type === 'Error',
                ).length,

            success:
                active.filter(
                    notification =>
                        notification.type === 'Success',
                ).length,

            info:
                active.filter(
                    notification =>
                        notification.type === 'Info',
                ).length,

            archived:
                notifications.filter(
                    notification =>
                        notification.archived,
                ).length,

        };

    }

}

export const NotificationRepositoryInstance =
    new NotificationRepository();
