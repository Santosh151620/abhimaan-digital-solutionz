import type {
    Task,
    TaskSearchFilters,
    TaskStatus,
    TaskSummary,
} from '@/types/crm/Tasks';

class TasksRepository {

    private readonly tasks =
        new Map<string, Task>();

    list(): Task[] {

        return [
            ...this.tasks.values(),
        ]
            .filter(
                task => !task.archived,
            )
            .sort(
                (a, b) =>
                    b.createdAt.localeCompare(
                        a.createdAt,
                    ),
            );

    }

    listArchived(): Task[] {

        return [
            ...this.tasks.values(),
        ]
            .filter(
                task => task.archived,
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
    ): Task | null {

        return (
            this.tasks.get(id)
            ?? null
        );

    }

    findById(
        id: string,
    ): Task | null {

        return this.details(
            id,
        );

    }

    search(
        filters?: TaskSearchFilters,
    ): Task[] {

        let tasks =
            this.list();

        if (
            filters?.status
        ) {

            tasks =
                tasks.filter(
                    task =>
                        task.status ===
                        filters.status,
                );

        }

        if (
            filters?.priority
        ) {

            tasks =
                tasks.filter(
                    task =>
                        task.priority ===
                        filters.priority,
                );

        }

        if (
            filters?.companyId
        ) {

            tasks =
                tasks.filter(
                    task =>
                        task.companyId ===
                        filters.companyId,
                );

        }

        if (
            filters?.projectId
        ) {

            tasks =
                tasks.filter(
                    task =>
                        task.projectId ===
                        filters.projectId,
                );

        }

        if (
            filters?.assignedTo
        ) {

            tasks =
                tasks.filter(
                    task =>
                        task.assignedTo ===
                        filters.assignedTo,
                );

        }

        if (
            filters?.search
        ) {

            const keyword =
                filters.search
                    .trim()
                    .toLowerCase();

            tasks =
                tasks.filter(
                    task =>

                        task.taskNumber
                            .toLowerCase()
                            .includes(
                                keyword,
                            )

                        ||

                        task.title
                            .toLowerCase()
                            .includes(
                                keyword,
                            )

                        ||

                        (
                            task.description
                                ?.toLowerCase()
                                .includes(
                                    keyword,
                                )
                            ?? false
                        )

                        ||

                        (
                            task.assignedTo
                                ?.toLowerCase()
                                .includes(
                                    keyword,
                                )
                            ?? false
                        ),

                );

        }

        return tasks;

    }

    create(
        data: Partial<Task>,
    ): Task {

        const now =
            new Date()
                .toISOString();

        const task: Task = {

            id:
                data.id ??
                crypto.randomUUID(),

            taskNumber:
                data.taskNumber ??
                `TSK-${Date.now()}`,

            projectId:
                data.projectId,

            companyId:
                data.companyId,

            assignedTo:
                data.assignedTo,

            title:
                data.title ??
                '',

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
                    data.status ===
                    'Completed'
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

        this.tasks.set(
            task.id,
            task,
        );

        return task;

    }
        update(
        id: string,
        data: Partial<Task>,
    ): Task | null {

        const existing =
            this.tasks.get(id);

        if (!existing) {

            return null;

        }

        const status =
            data.status ??
            existing.status;

        const completionPercentage =
            data.completionPercentage ??
            (
                status === 'Completed'
                    ? 100
                    : existing.completionPercentage ?? 0
            );

        const updated: Task = {

            ...existing,

            ...data,

            completionPercentage,

            completedAt:

                status === 'Completed'

                    ? (
                        data.completedAt ??
                        existing.completedAt ??
                        new Date().toISOString()
                    )

                    : data.completedAt ??
                      existing.completedAt,

            updatedAt:
                new Date().toISOString(),

        };

        this.tasks.set(
            id,
            updated,
        );

        return updated;

    }

    updateStatus(
        id: string,
        status: TaskStatus,
    ): Task | null {

        return this.update(
            id,
            {
                status,
            },
        );

    }

    delete(
        id: string,
    ): boolean {

        const existing =
            this.tasks.get(id);

        if (!existing) {

            return false;

        }

        existing.archived =
            true;

        existing.updatedAt =
            new Date().toISOString();

        this.tasks.set(
            id,
            existing,
        );

        return true;

    }

    restore(
        id: string,
    ): boolean {

        const existing =
            this.tasks.get(id);

        if (!existing) {

            return false;

        }

        existing.archived =
            false;

        existing.updatedAt =
            new Date().toISOString();

        this.tasks.set(
            id,
            existing,
        );

        return true;

    }

    summary(): TaskSummary {

        const tasks =
            this.list();

        const archived =
            this.listArchived();

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

        const today =
            new Date()
                .toISOString()
                .substring(0, 10);

        return {

            total:
                tasks.length,

            todo:
                tasks.filter(
                    task =>
                        task.status ===
                        'Todo',
                ).length,

            inProgress:
                tasks.filter(
                    task =>
                        task.status ===
                        'In Progress',
                ).length,

            blocked:
                tasks.filter(
                    task =>
                        task.status ===
                        'Blocked',
                ).length,

            completed:
                tasks.filter(
                    task =>
                        task.status ===
                        'Completed',
                ).length,

            cancelled:
                tasks.filter(
                    task =>
                        task.status ===
                        'Cancelled',
                ).length,

            critical:
                tasks.filter(
                    task =>
                        task.priority ===
                        'Critical',
                ).length,

            highPriority:
                tasks.filter(
                    task =>

                        task.priority ===
                            'High'

                        ||

                        task.priority ===
                            'Critical',

                ).length,

            overdue:
                tasks.filter(
                    task =>

                        !!task.dueDate

                        &&

                        task.dueDate < today

                        &&

                        task.status !==
                            'Completed'

                        &&

                        task.status !==
                            'Cancelled',

                ).length,

            archived:
                archived.length,

            averageCompletion:

                tasks.length === 0

                    ? 0

                    : Math.round(
                        totalCompletion /
                        tasks.length,
                    ),

        };

    }

}

export const
    TasksRepositoryInstance =
        new TasksRepository();
