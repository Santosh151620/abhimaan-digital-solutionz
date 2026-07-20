import type {
    Task,
    TaskStatus,
} from '@/types/crm/Tasks';

class TasksRepository {

    private tasks =
        new Map<string, Task>();

    list() {
        return Array.from(
            this.tasks.values()
        ).filter(
            task => !task.archived
        );
    }

    listArchived() {
        return Array.from(
            this.tasks.values()
        ).filter(
            task => task.archived
        );
    }

    details(
        id: string
    ) {
        return this.tasks.get(id) ?? null;
    }

    findById(
        id: string
    ) {
        return this.details(id);
    }

    create(
        data: Partial<Task>
    ) {

        const now =
            new Date().toISOString();

        const task: Task = {

            id:
                crypto.randomUUID(),

            taskNumber:
                data.taskNumber ??
                `TSK-${Date.now()}`,

            title:
                data.title ?? '',

            description:
                data.description,

            companyId:
                data.companyId,

            projectId:
                data.projectId,

            assignedTo:
                data.assignedTo,

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

            estimatedHours:
                data.estimatedHours,

            actualHours:
                data.actualHours,

            archived:
                false,

            createdAt:
                now,

            updatedAt:
                now,

        };

        this.tasks.set(
            task.id,
            task
        );

        return task;

    }

    update(
        id: string,
        data: Partial<Task>
    ) {

        const existing =
            this.tasks.get(id);

        if (!existing) {
            return null;
        }

        const updated: Task = {

            ...existing,

            ...data,

            updatedAt:
                new Date().toISOString(),

        };

        this.tasks.set(
            id,
            updated
        );

        return updated;

    }

    updateStatus(
        id: string,
        status: TaskStatus
    ) {
        return this.update(
            id,
            { status }
        );
    }

    delete(
        id: string
    ) {

        const existing =
            this.tasks.get(id);

        if (!existing) {
            return false;
        }

        existing.archived = true;

        existing.updatedAt =
            new Date().toISOString();

        this.tasks.set(
            id,
            existing
        );

        return true;

    }

    restore(
        id: string
    ) {

        const existing =
            this.tasks.get(id);

        if (!existing) {
            return false;
        }

        existing.archived = false;

        existing.updatedAt =
            new Date().toISOString();

        this.tasks.set(
            id,
            existing
        );

        return true;

    }
    search(
        filters?: {

            status?: TaskStatus;

            priority?: Task['priority'];

            search?: string;

        }
    ) {


        let tasks =
            this.list();



        if (
            filters?.status
        ) {

            tasks =
                tasks.filter(
                    task =>
                        task.status ===
                        filters.status
                );

        }



        if (
            filters?.priority
        ) {

            tasks =
                tasks.filter(
                    task =>
                        task.priority ===
                        filters.priority
                );

        }



        if (
            filters?.search
        ) {

            const keyword =
                filters.search.toLowerCase();



            tasks =
                tasks.filter(
                    task =>

                        task.title
                            .toLowerCase()
                            .includes(
                                keyword
                            )

                        ||

                        (
                            task.description
                                ?.toLowerCase()
                                .includes(
                                    keyword
                                )
                        )

                );

        }



        return tasks;

    }
    summary() {

        const tasks =
            this.list();

        return {

            total:
                tasks.length,

            todo:
                tasks.filter(
                    task =>
                        task.status ===
                        'Todo'
                ).length,

            inProgress:
                tasks.filter(
                    task =>
                        task.status ===
                        'In Progress'
                ).length,

            blocked:
                tasks.filter(
                    task =>
                        task.status ===
                        'Blocked'
                ).length,

            completed:
                tasks.filter(
                    task =>
                        task.status ===
                        'Completed'
                ).length,

            cancelled:
                tasks.filter(
                    task =>
                        task.status ===
                        'Cancelled'
                ).length,

            critical:
                tasks.filter(
                    task =>
                        task.priority ===
                        'Critical'
                ).length,

        };

    }

}

export const
    TasksRepositoryInstance =
        new TasksRepository();