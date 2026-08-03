import type {
    SupabaseClient,
} from '@supabase/supabase-js';


import {
    BaseRepository,
} from '@/lib/db/base-repository';


import type {
    Notification,
    NotificationSearchFilters,
    NotificationStatus,
    NotificationSummary,
} from '@/types/crm/Notifications';



export class NotificationsRepository
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





    async details(
        id: string,
    ): Promise<Notification | null> {

        return this.findById(
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



        if (
            filters?.status
        ) {

            query =
                query.eq(
                    'status',
                    filters.status,
                );

        }



        if (
            filters?.priority
        ) {

            query =
                query.eq(
                    'priority',
                    filters.priority,
                );

        }



        if (
            filters?.type
        ) {

            query =
                query.eq(
                    'notification_type',
                    filters.type,
                );

        }



        if (
            filters?.entityType
        ) {

            query =
                query.eq(
                    'entity_type',
                    filters.entityType,
                );

        }



        if (
            filters?.entityId
        ) {

            query =
                query.eq(
                    'entity_id',
                    filters.entityId,
                );

        }



        if (
            filters?.ownerId
        ) {

            query =
                query.eq(
                    'owner_id',
                    filters.ownerId,
                );

        }



        if (
            filters?.userId
        ) {

            query =
                query.eq(
                    'user_id',
                    filters.userId,
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



        if (
            filters?.search
        ) {

            const keyword =
                filters.search
                    .trim()
                    .toLowerCase();



            notifications =
                notifications.filter(
                    item =>

                        item.notificationNumber
                            ?.toLowerCase()
                            .includes(
                                keyword,
                            )

                        ||

                        item.title
                            ?.toLowerCase()
                            .includes(
                                keyword,
                            )

                        ||

                        item.message
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



        const payload = {


            notificationNumber:

                data.notificationNumber ??

                `NTF-${Date.now()}`,



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



            notificationType:

                data.type ?? 'System',



            priority:

                data.priority ?? 'Medium',



            status:

                data.status ?? 'Unread',



            actionUrl:

                data.actionUrl,



            actionLabel:

                data.actionLabel,



            icon:

                data.icon,



            metadata:

                data.metadata ?? {},



            readAt:

                data.readAt,



            archived:

                false,



            createdAt:

                now,



            updatedAt:

                now,

        };



        return super.create(
            payload,
        );

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





    async updateStatus(
        id: string,
        status: NotificationStatus,
    ): Promise<Notification> {


        return this.update(
            id,
            {

                status,


                readAt:

                    status === 'Read'

                        ? new Date()
                            .toISOString()

                        : undefined,

            },
        );

    }

    async delete(
        id: string,
    ): Promise<void> {

        const {
            error,
        } =
            await this.tableRef()
                .update(
                    {
                        archived: true,

                        status:
                            'Archived',

                        updated_at:
                            new Date()
                                .toISOString(),
                    },
                )
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .eq(
                    'id',
                    id,
                );


        if (error) {

            throw error;

        }

    }

    async restore(
        id: string,
    ): Promise<boolean> {


        const {
            error,
        } =
            await this.tableRef()
                .update(
                    {

                        archived:
                            false,

                        status:
                            'Unread',

                        updated_at:
                            new Date()
                                .toISOString(),

                    },
                )
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .eq(
                    'id',
                    id,
                );



        if (error) {

            throw error;

        }



        return true;

    }





    async summary(): Promise<NotificationSummary> {


        const active =
            await this.list();


        const archived =
            await this.listArchived();

        return {

            total:
                active.length,
            unread:
                active.filter(
                    item =>
                        item.status === 'Unread',
                ).length,
            read:
                active.filter(
                    item =>
                        item.status === 'Read',
                ).length,
            archived:
                archived.length,
            lowPriority:
                active.filter(
                    item =>
                        item.priority === 'Low',
                ).length,
            mediumPriority:
                active.filter(
                    item =>
                        item.priority === 'Medium',
                ).length,
            highPriority:
                active.filter(
                    item =>
                        item.priority === 'High',
                ).length,
            criticalPriority:
                active.filter(
                    item =>
                        item.priority === 'Critical',
                ).length,
        };
    }
    async findByEntity(
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
                .order(
                    'created_at',
                    {
                        ascending:false,
                    },
                );
        if(error){
            throw error;
        }
        return (
            data ?? []
        ) as Notification[];
        }

}
export function createNotificationsRepository(
    supabase: SupabaseClient,
) {

    return new NotificationsRepository(
        supabase,
    );

}