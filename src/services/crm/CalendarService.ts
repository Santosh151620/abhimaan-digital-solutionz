import {
    CalendarRepositoryInstance,
} from '@/repositories/crm/CalendarRepository';

import type {
    CalendarEvent,
    CalendarSearchFilters,
    CalendarStatus,
    CalendarSummary,
} from '@/types/crm/Calendar';

class CalendarService {

    list() {
        return CalendarRepositoryInstance.list();
    }

    listArchived() {
        return CalendarRepositoryInstance.listArchived();
    }

    details(id: string) {
        return CalendarRepositoryInstance.details(id);
    }
findById(
    id: string,
) {

    return CalendarRepositoryInstance.findById(
        id,
    );

}
search(
    filters?: CalendarSearchFilters,
) {

    return CalendarRepositoryInstance.search(
        filters,
    );

}
    create(
        data: Partial<CalendarEvent>,
    ) {
        return CalendarRepositoryInstance.create(data);
    }

    update(
        id: string,
        data: Partial<CalendarEvent>,
    ) {
        return CalendarRepositoryInstance.update(id, data);
    }

    updateStatus(
        id: string,
        status: CalendarStatus,
    ) {
        return CalendarRepositoryInstance.updateStatus(
            id,
            status,
        );
    }

    delete(id: string) {
        return CalendarRepositoryInstance.delete(id);
    }

    restore(id: string) {
        return CalendarRepositoryInstance.restore(id);
    }

    summary(): CalendarSummary {
        return CalendarRepositoryInstance.summary();
    }

}

export async function createCalendarService() {

    return new CalendarService();

}

export const CalendarServiceInstance =
    new CalendarService();

