import type {
    SupabaseClient,
} from '@supabase/supabase-js';

import {
    BaseRepository,
} from '@/lib/db/base-repository';

import type {
    Notification,
    NotificationSummary,
    NotificationType,
    NotificationPriority,
} from '@/types/crm/Notification';



export interface NotificationSearchFilters {

    userId?: string;

    entityType?: string;

    entityId?: string;

    type?: NotificationType;

    priority?: NotificationPriority;

    read?: boolean;

    archived?: boolean;

    search?: string;

}



class NotificationRepository
    extends BaseRepository<Notification> {

    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            'notifications',
        );

    }



    async list(): Promise<Notification[]> {

        const {
            data,
            error,
        } =
            await this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .eq(
                    'archived',
                    false,
                )
                .order(
                    'created_at',
                    {
                        ascending: false,
                    },
                );

        if (error) {

            throw error;

        }

        return (
            data ?? []
        ) as Notification[];

    }



    async listArchived(): Promise<Notification[]> {

        const {
            data,
            error,
        } =
            await this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .eq(
                    'archived',
                    true,
                )
                .order(
                    'updated_at',
                    {
                        ascending: false,
                    },
                );

        if (error) {

            throw error;

        }

        return (
            data ?? []
        ) as Notification[];

    }



    async listUnread(): Promise<Notification[]> {

        const {
            data,
            error,
        } =
            await this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .eq(
                    'archived',
                    false,
                )
                .eq(
                    'read',
                    false,
                )
                .order(
                    'created_at',
                    {
                        ascending: false,
                    },
                );

        if (error) {

            throw error;

        }

        return (
            data ?? []
        ) as Notification[];

    }



    async details(
        id: string,
    ): Promise<Notification | null> {

        return super.findById(
            id,
        );

    }



    async findById(
        id: string,
    ): Promise<Notification | null> {

        return super.findById(
            id,
        );

    }



    async listByUser(
        userId: string,
    ): Promise<Notification[]> {

        const {
            data,
            error,
        } =
            await this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .eq(
                    'user_id',
                    userId,
                )
                .eq(
                    'archived',
                    false,
                )
                .order(
                    'created_at',
                    {
                        ascending: false,
                    },
                );

        if (error) {

            throw error;

        }

        return (
            data ?? []
        ) as Notification[];

    }



    async listByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Notification[]> {

        const {
            data,
            error,
        } =
            await this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .eq(
                    'entity_type',
                    entityType,
                )
                .eq(
                    'entity_id',
                    entityId,
                )
                .eq(
                    'archived',
                    false,
                );

        if (error) {

            throw error;

        }

        return (
            data ?? []
        ) as Notification[];

    }

    async findByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Notification[]> {

        return this.listByEntity(
            entityType,
            entityId,
        );

    }

    async search(
        filters?: NotificationSearchFilters,
    ): Promise<Notification[]> {

        let query =
            this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId,
                );

        if (filters?.userId) {

            query =
                query.eq(
                    'user_id',
                    filters.userId,
                );

        }

        if (filters?.entityType) {

            query =
                query.eq(
                    'entity_type',
                    filters.entityType,
                );

        }

        if (filters?.entityId) {

            query =
                query.eq(
                    'entity_id',
                    filters.entityId,
                );

        }

        if (filters?.type) {

            query =
                query.eq(
                    'type',
                    filters.type,
                );

        }

        if (filters?.priority) {

            query =
                query.eq(
                    'priority',
                    filters.priority,
                );

        }

        if (
            filters?.read !== undefined
        ) {

            query =
                query.eq(
                    'read',
                    filters.read,
                );

        }

        if (
            filters?.archived !== undefined
        ) {

            query =
                query.eq(
                    'archived',
                    filters.archived,
                );

        }

        const {
            data,
            error,
        } =
            await query.order(
                'created_at',
                {
                    ascending: false,
                },
            );

        if (error) {

            throw error;

        }

        let notifications =
            (
                data ?? []
            ) as Notification[];

        if (filters?.search) {

            const keyword =
                filters.search
                    .trim()
                    .toLowerCase();

            notifications =
                notifications.filter(
                    notification =>

                        notification.title
                            ?.toLowerCase()
                            .includes(
                                keyword,
                            )

                        ||

                        notification.message
                            ?.toLowerCase()
                            .includes(
                                keyword,
                            ),
                );

        }

        return notifications;

    }



    async create(
        data: Partial<Notification>,
    ): Promise<Notification> {

        const now =
            new Date()
                .toISOString();

        return super.create({

            ...data,

            read:
                data.read ??
                false,

            archived:
                false,

            createdAt:
                now,

            updatedAt:
                now,

        });

    }



    async update(
        id: string,
        data: Partial<Notification>,
    ): Promise<Notification> {

        return super.update(
            id,
            {

                ...data,

                updatedAt:
                    new Date()
                        .toISOString(),

            },
        );

    }



    async markAsRead(
        id: string,
    ): Promise<Notification> {

        return this.update(
            id,
            {
                read: true,
                readAt:
                    new Date()
                        .toISOString(),
            },
        );

    }



    async markAsUnread(
        id: string,
    ): Promise<Notification> {

        return this.update(
            id,
            {
                read: false,
                readAt: undefined,
            },
        );

    }



    async archive(
        id: string,
    ): Promise<Notification> {

        return this.update(
            id,
            {
                archived: true,
            },
        );

    }



    async restore(
        id: string,
    ): Promise<Notification> {

        return this.update(
            id,
            {
                archived: false,
            },
        );

    }



    async delete(
        id: string,
    ): Promise<void> {

        await this.archive(
            id,
        );

    }



    async summary(): Promise<NotificationSummary> {

        const notifications =
            await this.list();

        const archived =
            await this.listArchived();

        return {

            total:
                notifications.length,

            unread:
                notifications.filter(
                    n => !n.read,
                ).length,

            read:
                notifications.filter(
                    n => n.read,
                ).length,

            highPriority:
                notifications.filter(
                    n =>
                        n.priority === 'High',
                ).length,

            warning:
                notifications.filter(
                    n =>
                        n.type === 'Warning',
                ).length,

            error:
                notifications.filter(
                    n =>
                        n.type === 'Error',
                ).length,

            success:
                notifications.filter(
                    n =>
                        n.type === 'Success',
                ).length,

            info:
                notifications.filter(
                    n =>
                        n.type === 'Info',
                ).length,

            archived:
                archived.length,

        };

    }

}

export function createNotificationRepository(
    supabase: SupabaseClient,
) {

    return new NotificationRepository(
        supabase,
    );

}
export {
    createNotificationRepository as NotificationsRepository,
};