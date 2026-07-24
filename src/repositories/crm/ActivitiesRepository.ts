import type {
    Activity,
    ActivitySearchFilters,
    ActivityStatus,
    ActivitySummary,
} from '@/types/crm/Activities';

class ActivitiesRepository {

    private activities =
        new Map<string, Activity>();

    list(): Activity[] {

        return [
            ...this.activities.values(),
        ]
            .filter(
                activity =>
                    !activity.archived,
            )
            .sort(
                (a, b) =>
                    b.createdAt.localeCompare(
                        a.createdAt,
                    ),
            );

    }

    listArchived(): Activity[] {

        return [
            ...this.activities.values(),
        ]
            .filter(
                activity =>
                    activity.archived,
            )
            .sort(
                (a, b) =>
                    b.updatedAt.localeCompare(
                        a.updatedAt,
                    ),
            );

    }

    findById(
        id: string,
    ): Activity | null {

        return (
            this.activities.get(id)
            ?? null
        );

    }

    details(
        id: string,
    ): Activity | null {

        return this.findById(
            id,
        );

    }

    search(
        filters?: ActivitySearchFilters,
    ): Activity[] {

        let activities =
            this.list();

        if (
            filters?.entityType
        ) {

            activities =
                activities.filter(
                    activity =>
                        activity.entityType ===
                        filters.entityType,
                );

        }

        if (
            filters?.entityId
        ) {

            activities =
                activities.filter(
                    activity =>
                        activity.entityId ===
                        filters.entityId,
                );

        }

        if (
            filters?.companyId
        ) {

            activities =
                activities.filter(
                    activity =>
                        activity.companyId ===
                        filters.companyId,
                );

        }

        if (
            filters?.contactId
        ) {

            activities =
                activities.filter(
                    activity =>
                        activity.contactId ===
                        filters.contactId,
                );

        }

        if (
            filters?.ownerId
        ) {

            activities =
                activities.filter(
                    activity =>
                        activity.ownerId ===
                        filters.ownerId,
                );

        }

        if (
            filters?.assignedTo
        ) {

            activities =
                activities.filter(
                    activity =>
                        activity.assignedTo ===
                        filters.assignedTo,
                );

        }

        if (
            filters?.status
        ) {

            activities =
                activities.filter(
                    activity =>
                        activity.status ===
                        filters.status,
                );

        }

        if (
            filters?.priority
        ) {

            activities =
                activities.filter(
                    activity =>
                        activity.priority ===
                        filters.priority,
                );

        }

        if (
            filters?.type
        ) {

            activities =
                activities.filter(
                    activity =>
                        activity.type ===
                        filters.type,
                );

        }

        if (
            filters?.search
        ) {

            const keyword =
                filters.search
                    .trim()
                    .toLowerCase();

            activities =
                activities.filter(
                    activity =>

                        activity.title
                            .toLowerCase()
                            .includes(
                                keyword,
                            )

                        ||

                        activity.description
                            ?.toLowerCase()
                            .includes(
                                keyword,
                            )

                        ||

                        activity.activityNumber
                            .toLowerCase()
                            .includes(
                                keyword,
                            ),

                );

        }

        return activities;

    }

    create(
        data: Partial<Activity>,
    ): Activity {

        const now =
            new Date()
                .toISOString();

        const activity: Activity = {

            id:
                data.id ??
                crypto.randomUUID(),

            activityNumber:
                data.activityNumber ??
                `ACT-${Date.now()}`,

            entityType:
                data.entityType ??
                'General',

            entityId:
                data.entityId ??
                '',

            companyId:
                data.companyId,

            contactId:
                data.contactId,

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

            completedAt:
                data.completedAt,

            dueAt:
                data.dueAt,

            durationMinutes:
                data.durationMinutes,

            reminderAt:
                data.reminderAt,

            reminderMinutes:
                data.reminderMinutes,

            location:
                data.location,

            outcome:
                data.outcome,

            nextAction:
                data.nextAction,

            archived:
                false,

            createdAt:
                now,

            updatedAt:
                now,

        };

        this.activities.set(
            activity.id,
            activity,
        );

        return activity;

    }
        update(
        id: string,
        data: Partial<Activity>,
    ): Activity | null {

        const existing =
            this.activities.get(
                id,
            );

        if (!existing) {

            return null;

        }

        const updated: Activity = {

            ...existing,

            ...data,

            id,

            updatedAt:
                new Date()
                    .toISOString(),

        };

        this.activities.set(
            id,
            updated,
        );

        return updated;

    }

    updateStatus(
        id: string,
        status: ActivityStatus,
    ): Activity | null {

        const completedAt =

            status === 'Completed'

                ? new Date()
                    .toISOString()

                : undefined;

        return this.update(
            id,
            {
                status,
                completedAt,
            },
        );

    }

    delete(
        id: string,
    ): boolean {

        const existing =
            this.activities.get(
                id,
            );

        if (!existing) {

            return false;

        }

        existing.archived =
            true;

        existing.updatedAt =
            new Date()
                .toISOString();

        this.activities.set(
            id,
            existing,
        );

        return true;

    }

    restore(
        id: string,
    ): boolean {

        const existing =
            this.activities.get(
                id,
            );

        if (!existing) {

            return false;

        }

        existing.archived =
            false;

        existing.updatedAt =
            new Date()
                .toISOString();

        this.activities.set(
            id,
            existing,
        );

        return true;

    }

    summary(): ActivitySummary {

        const activities =
            this.list();

        const now =
            new Date();

        const today =
            now
                .toISOString()
                .substring(
                    0,
                    10,
                );

        const completed =
            activities.filter(
                activity =>
                    activity.status ===
                    'Completed',
            ).length;

        return {

            total:
                activities.length,

            planned:
                activities.filter(
                    activity =>
                        activity.status ===
                        'Planned',
                ).length,

            inProgress:
                activities.filter(
                    activity =>
                        activity.status ===
                        'In Progress',
                ).length,

            completed,

            cancelled:
                activities.filter(
                    activity =>
                        activity.status ===
                        'Cancelled',
                ).length,

            missed:
                activities.filter(
                    activity =>
                        activity.status ===
                        'Missed',
                ).length,

            overdue:
                activities.filter(
                    activity =>

                        activity.status !==
                        'Completed'

                        &&

                        !!activity.dueAt

                        &&

                        activity.dueAt <
                        now.toISOString(),

                ).length,

            today:
                activities.filter(
                    activity =>

                        activity.scheduledAt
                            ?.startsWith(
                                today,
                            ),

                ).length,

            upcoming:
                activities.filter(
                    activity =>

                        !!activity.scheduledAt

                        &&

                        activity.scheduledAt >
                        now.toISOString(),

                ).length,

            highPriority:
                activities.filter(
                    activity =>

                        activity.priority ===
                        'High'

                        ||

                        activity.priority ===
                        'Critical',

                ).length,

            archived:
                this.listArchived()
                    .length,

            completionRate:

                activities.length === 0

                    ? 0

                    : Number(

                        (
                            completed
                            /
                            activities.length
                        )
                        * 100,

                    ),

        };

    }

}

export const activitiesRepository =
    new ActivitiesRepository();

/**
 * Backward compatibility alias.
 */
export const ActivitiesRepositoryInstance =
    activitiesRepository;
