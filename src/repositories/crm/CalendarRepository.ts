import type {
    CalendarEvent,
    CalendarStatus,
} from '@/types/crm/Calendar';

class CalendarRepository {

    private events =
        new Map<string, CalendarEvent>();

    list() {

        return Array.from(
            this.events.values(),
        ).filter(
            event => !event.archived,
        );

    }

    listArchived() {

        return Array.from(
            this.events.values(),
        ).filter(
            event => event.archived,
        );

    }

    details(
        id: string,
    ) {

        return this.events.get(id) ?? null;

    }

    create(
        data: Partial<CalendarEvent>,
    ): CalendarEvent {

        const now =
            new Date().toISOString();

        const event: CalendarEvent = {

            id:
                crypto.randomUUID(),

            eventNumber:
                data.eventNumber ??
                `EVT-${Date.now()}`,

            companyId:
                data.companyId,

            customerName:
                data.customerName,

            projectId:
                data.projectId,

            assignedTo:
                data.assignedTo,

            title:
                data.title ?? '',

            description:
                data.description,

            eventType:
                data.eventType ?? 'Meeting',

            status:
                data.status ?? 'Scheduled',

            priority:
                data.priority ?? 'Medium',

            startDate:
                data.startDate ?? '',

            endDate:
                data.endDate ?? '',

            allDay:
                data.allDay ?? false,

            location:
                data.location,

            reminderMinutes:
                data.reminderMinutes,

            recurring:
                data.recurring,

            color:
                data.color,

            archived:
                false,

            createdAt:
                now,

            updatedAt:
                now,

        };

        this.events.set(
            event.id,
            event,
        );

        return event;

    }

    update(
        id: string,
        data: Partial<CalendarEvent>,
    ) {

        const existing =
            this.events.get(id);

        if (!existing) {

            return null;

        }

        const updated: CalendarEvent = {

            ...existing,

            ...data,

            updatedAt:
                new Date().toISOString(),

        };

        this.events.set(
            id,
            updated,
        );

        return updated;

    }

    updateStatus(
        id: string,
        status: CalendarStatus,
    ) {

        return this.update(
            id,
            {
                status,
            },
        );

    }

    delete(
        id: string,
    ) {

        const event =
            this.events.get(id);

        if (!event) {

            return false;

        }

        event.archived = true;

        event.updatedAt =
            new Date().toISOString();

        this.events.set(
            id,
            event,
        );

        return true;

    }

    restore(
        id: string,
    ) {

        const event =
            this.events.get(id);

        if (!event) {

            return false;

        }

        event.archived = false;

        event.updatedAt =
            new Date().toISOString();

        this.events.set(
            id,
            event,
        );

        return true;

    }

    summary() {

        const events =
            this.list();

        const today =
            new Date().toISOString().slice(0, 10);

        return {

            total:
                events.length,

            scheduled:
                events.filter(
                    e => e.status === 'Scheduled',
                ).length,

            inProgress:
                events.filter(
                    e => e.status === 'In Progress',
                ).length,

            completed:
                events.filter(
                    e => e.status === 'Completed',
                ).length,

            cancelled:
                events.filter(
                    e => e.status === 'Cancelled',
                ).length,

            missed:
                events.filter(
                    e => e.status === 'Missed',
                ).length,

            today:
                events.filter(
                    e => e.startDate === today,
                ).length,

            upcoming:
                events.filter(
                    e => e.startDate > today,
                ).length,

        };

    }

}

export const
    CalendarRepositoryInstance =
        new CalendarRepository();