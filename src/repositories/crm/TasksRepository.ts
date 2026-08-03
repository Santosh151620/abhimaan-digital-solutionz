import type {
    SupabaseClient,
} from '@supabase/supabase-js';


import {
    BaseRepository,
} from '@/lib/db/base-repository';


import type {
    Task,
    TaskSearchFilters,
    TaskStatus,
    TaskSummary,
} from '@/types/crm/Tasks';



class TasksRepository
    extends BaseRepository<Task> {


    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            'tasks',
        );

    }



    async list(): Promise<Task[]> {

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
        ) as Task[];

    }



    async listArchived(): Promise<Task[]> {

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
        ) as Task[];

    }

async details(
    id: string,
): Promise<Task | null> {

    return super.findById(
        id,
    );

}

    async findById(
        id: string,
    ): Promise<Task | null> {


        return super.findById(
            id,
        );

    }

   async findByEntity(
    entityType: string,
    entityId: string,
): Promise<Task[]> {

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
    ) as Task[];

}
    async search(
        filters?: TaskSearchFilters,
    ): Promise<Task[]> {


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
            filters?.assignedTo
        ) {

            query =
                query.eq(
                    'assigned_to',
                    filters.assignedTo,
                );

        }



        const {
            data,
            error,
        } =
            await query
                .order(
                    'created_at',
                    {
                        ascending: false,
                    },
                );

        if (error) {

            throw error;

        }



        let tasks =
            (
                data ?? []
            ) as Task[];



        if (
            filters?.search
        ) {

            const keyword =
                filters.search
                    .trim()
                    .toLowerCase();



            tasks =
                (
                    data ?? []
                )
                    .filter(
                        task => {


                            const item =
                                task as Task;



                            return (

                                item.taskNumber
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

                                item.description
                                    ?.toLowerCase()
                                    .includes(
                                        keyword,
                                    )

                            );


                        },
                    ) as Task[];

        }



        return tasks;

    }





    async create(
        data: Partial<Task>,
    ): Promise<Task> {


        const now =
            new Date()
                .toISOString();



       const payload = {

    entity_type:
        'Task',

    entity_id:
        data.entityId ??
        crypto.randomUUID(),

            taskNumber:
                data.taskNumber ??
                `TSK-${Date.now()}`,

            assignedTo:
                data.assignedTo,



            ownerId:
                data.ownerId,



            title:
                data.title ?? '',



            description:
                data.description,



            status:
                data.status ??
                'Todo',



            priority:
                data.priority ??
                'Medium',



            startDate:
                data.startDate,



            dueDate:
                data.dueDate,



            completedAt:
                data.completedAt,



            estimatedHours:
                data.estimatedHours,



            actualHours:
                data.actualHours,



            completionPercentage:
                data.completionPercentage ??
                (
                    data.status === 'Completed'
                        ? 100
                        : 0
                ),



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
        data: Partial<Task>,
    ): Promise<Task> {


        const status =
            data.status;

        const payload = {

            ...data,


            completionPercentage:

                data.completionPercentage ??

                (
                    status === 'Completed'
                        ? 100
                        : undefined
                ),



            completedAt:

                status === 'Completed'

                    ? (
                        data.completedAt ??
                        new Date()
                            .toISOString()
                    )

                    : data.completedAt,
                
            updatedAt:
                new Date()
                    .toISOString(),

        };

        return super.update(
            id,
            payload,
        );
    }

    async updateStatus(
        id: string,
        status: TaskStatus,
    ): Promise<Task> {


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

        return;

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





    async summary(): Promise<TaskSummary> {


        const tasks =
            await this.list();



        const archived =
            await this.listArchived();



        const today =
            new Date()
                .toISOString()
                .substring(
                    0,
                    10,
                );



        const totalCompletion =
            tasks.reduce(
                (
                    sum,
                    task,
                ) =>
                    sum +
                    (
                        task.completionPercentage ??
                        (
                            task.status === 'Completed'
                                ? 100
                                : 0
                        )
                    ),
                0,
            );

        return {
            total:
                tasks.length,
            todo:
                tasks.filter(
                    task =>
                        task.status === 'Todo',
                )
                    .length,
            inProgress:
                tasks.filter(
                    task =>
                        task.status === 'In Progress',
                )
                    .length,
            blocked:
                tasks.filter(
                    task =>
                        task.status === 'Blocked',
                )
                    .length,
            completed:
                tasks.filter(
                    task =>
                        task.status === 'Completed',
                )
                    .length,
            cancelled:
                tasks.filter(
                    task =>
                        task.status === 'Cancelled',
                )
                    .length,
            critical:
                tasks.filter(
                    task =>
                        task.priority === 'Critical',
                )
                    .length,
            highPriority:
                tasks.filter(
                    task =>
                        task.priority === 'High'
                        ||
                        task.priority === 'Critical',
                )
                    .length,
            overdue:
                tasks.filter(
                    task =>

                        !!task.dueDate

                        &&

                        task.dueDate < today

                        &&

                        task.status !== 'Completed'

                        &&

                        task.status !== 'Cancelled',

                )
                    .length,
            archived:
                archived.length,
            averageCompletion:

                tasks.length === 0
                    ? 0
                    :
                    Math.round(
                        totalCompletion /
                        tasks.length,
                    ),
        };

    }
}

export function createTasksRepository(
    supabase: SupabaseClient,
) {

    return new TasksRepository(
        supabase,
    );

}
