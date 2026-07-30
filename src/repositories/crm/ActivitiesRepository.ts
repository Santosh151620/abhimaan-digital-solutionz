import type {
    SupabaseClient,
} from '@supabase/supabase-js';

import {
    BaseRepository,
} from '@/lib/db/base-repository';

import type {
    Activity,
    ActivityStatus,
    ActivitySearchFilters,
    ActivitySummary,
} from '@/types/crm/Activities';


export class ActivitiesRepository
    extends BaseRepository<Activity> {


    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            'activities',
        );

    }
    async list(): Promise<Activity[]> {

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
            data ??
            []
        ) as Activity[];

    }




    async listArchived(): Promise<Activity[]> {

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
                    'created_at',
                    {
                        ascending: false,
                    },
                );

        if (error) {

            throw error;

        }

        return (
            data ??
            []
        ) as Activity[];

    }




    async findById(
        id: string,
    ): Promise<Activity | null> {

        return super.findById(
            id,
        );

    }




    async details(
        id: string,
    ): Promise<Activity | null> {

        return this.findById(
            id,
        );

    }




    async create(
        data: Partial<Activity>,
    ): Promise<Activity> {

        const now =
            new Date()
                .toISOString();

        return super.create({

            id:
                data.id ??
                crypto.randomUUID(),

            activityNumber:
                data.activityNumber ??
                `ACT-${Date.now()}`,

            entityType:
                data.entityType ??
                'Activity',

            entityId:
                data.entityId ??
                crypto.randomUUID(),

            organizationId:
                data.organizationId,

            leadId:
                data.leadId,

            companyId:
                data.companyId,

            contactId:
                data.contactId,

            opportunityId:
                data.opportunityId,

            projectId:
                data.projectId,

            ownerId:
                data.ownerId,

            assignedTo:
                data.assignedTo,

            title:
                data.title ??
                '',

            description:
                data.description,

            type:
                data.type ??
                'Other',

            status:
                data.status ??
                'Planned',

            priority:
                data.priority ??
                'Medium',

            scheduledAt:
                data.scheduledAt,

            startedAt:
                data.startedAt,

            startDate:
                data.startDate,

            dueAt:
                data.dueAt,

            dueDate:
                data.dueDate,

            completedAt:
                data.completedAt,

            reminderAt:
                data.reminderAt,

            reminderMinutes:
                data.reminderMinutes,

            durationMinutes:
                data.durationMinutes,

            outcome:
                data.outcome,

            nextAction:
                data.nextAction,

            location:
                data.location,

            notes:
                data.notes,

            metadata:
                data.metadata,

            archived:
                false,

            isArchived:
                false,

            deletedAt:
                null,

            createdAt:
                now,

            updatedAt:
                now,

        });

    }
    async update(
        id: string,
        data: Partial<Activity>,
    ): Promise<Activity> {

        return super.update(

            id,

            {

                ...data,

            },

        );

    }




    async updateStatus(
        id: string,
        status: ActivityStatus,
    ): Promise<Activity> {

        return this.update(

            id,

            {

                status,

            },

        );

    }

    async delete(
        id: string,
    ): Promise<void> {

        const existing =
            await this.findById(
                id,
            );


        if (!existing) {

            return;

        }


        const {
            error,
        } =
            await this.tableRef()
                .update(
                    {
                        archived: true,
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

        const existing =
            await this.findById(
                id,
            );


        if (!existing) {

            return false;

        }


        const {
            error,
        } =
            await this.tableRef()
                .update(
                    {
                        archived: false,
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

    async search(
        filters?: ActivitySearchFilters,
    ): Promise<Activity[]> {


        let query =
            this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .eq(
                    'archived',
                    false,
                );



        if (filters?.status) {

            query =
                query.eq(
                    'status',
                    filters.status,
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



        if (filters?.leadId) {

            query =
                query.eq(
                    'lead_id',
                    filters.leadId,
                );

        }



        if (filters?.companyId) {

            query =
                query.eq(
                    'company_id',
                    filters.companyId,
                );

        }



        if (filters?.contactId) {

            query =
                query.eq(
                    'contact_id',
                    filters.contactId,
                );

        }



        if (filters?.opportunityId) {

            query =
                query.eq(
                    'opportunity_id',
                    filters.opportunityId,
                );

        }



        if (filters?.projectId) {

            query =
                query.eq(
                    'project_id',
                    filters.projectId,
                );

        }



        if (filters?.ownerId) {

            query =
                query.eq(
                    'owner_id',
                    filters.ownerId,
                );

        }



        if (filters?.assignedTo) {

            query =
                query.eq(
                    'assigned_to',
                    filters.assignedTo,
                );

        }



        if (filters?.fromDate) {

            query =
                query.gte(
                    'start_date',
                    filters.fromDate,
                );

        }



        if (filters?.toDate) {

            query =
                query.lte(
                    'start_date',
                    filters.toDate,
                );

        }



        const keyword =
            filters?.keyword
            ??
            filters?.search;



        if (keyword) {

            query =
                query.or(

                    [

                        `title.ilike.%${keyword}%`,

                        `description.ilike.%${keyword}%`,

                        `activity_number.ilike.%${keyword}%`,

                    ].join(','),

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



        return (
            data ??
            []
        ) as Activity[];

    }
    async summary(): Promise<ActivitySummary> {

        const activities =
            await this.list();

        const today =
            new Date()
                .toISOString()
                .substring(0, 10);

        return {

            total:
                activities.length,

            planned:
                activities.filter(
                    activity =>
                        activity.status === 'Planned',
                ).length,

            inProgress:
                activities.filter(
                    activity =>
                        activity.status === 'In Progress',
                ).length,

            completed:
                activities.filter(
                    activity =>
                        activity.status === 'Completed',
                ).length,

            cancelled:
                activities.filter(
                    activity =>
                        activity.status === 'Cancelled',
                ).length,

            missed:
                activities.filter(
                    activity =>
                        activity.status === 'Missed',
                ).length,

            overdue:
                activities.filter(
                    activity =>
                        !!activity.startDate &&
                        activity.startDate < today &&
                        activity.status !== 'Completed' &&
                        activity.status !== 'Cancelled',
                ).length,

            today:
                activities.filter(
                    activity =>
                        activity.startDate === today,
                ).length,

            upcoming:
                activities.filter(
                    activity =>
                        !!activity.startDate &&
                        activity.startDate > today,
                ).length,

            highPriority:
                activities.filter(
                    activity =>
                        activity.priority === 'High' ||
                        activity.priority === 'Critical',
                ).length,

            archived: 0,

            completionRate:

                activities.length === 0
                    ? 0
                    :
                    Math.round(
                        (
                            activities.filter(
                                activity =>
                                    activity.status === 'Completed',
                            ).length
                            /
                            activities.length
                        ) * 100,
                    ),

        };

    }
    async findByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Activity[]> {

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
                        ascending: false,
                    },
                );


        if (error) {
            throw error;
        }


        return (
            data ?? []
        ) as Activity[];

    }
}

export function createActivitiesRepository(
    supabase: SupabaseClient,
) {

    return new ActivitiesRepository(
        supabase,
    );

}
export const ActivitiesRepositoryInstance =
    createActivitiesRepository;
