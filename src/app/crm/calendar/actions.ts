'use server';

import {
    CalendarServiceInstance,
} from '@/services/crm/CalendarService';

import {
    PermissionServiceInstance,
} from '@/services/crm/PermissionService';

import {
    CRM_ADMIN_ROLE,
} from '@/shared/crmPermissions';

import type {
    CalendarEvent,
    CalendarStatus,
} from '@/types/crm/Calendar';

function can(
    action:
        | 'create'
        | 'update'
        | 'delete',
) {

    return PermissionServiceInstance.hasPermission(

        CRM_ADMIN_ROLE,

        'Calendar',

        action,

    );

}

export async function getCalendarEvents() {

    return CalendarServiceInstance.list();

}

export async function getArchivedCalendarEvents() {

    return CalendarServiceInstance.listArchived();

}

export async function getCalendarEvent(
    id: string,
) {

    return CalendarServiceInstance.details(id);

}

export async function createCalendarEvent(
    data: Partial<CalendarEvent>,
) {

    if (!can('create')) {

        throw new Error(
            'Permission denied',
        );

    }

    return CalendarServiceInstance.create(data);

}

export async function updateCalendarEvent(
    id: string,
    data: Partial<CalendarEvent>,
) {

    if (!can('update')) {

        throw new Error(
            'Permission denied',
        );

    }

    return CalendarServiceInstance.update(
        id,
        data,
    );

}

export async function deleteCalendarEvent(
    id: string,
) {

    if (!can('delete')) {

        throw new Error(
            'Permission denied',
        );

    }

    return CalendarServiceInstance.delete(id);

}

export async function restoreCalendarEvent(
    id: string,
) {

    if (!can('update')) {

        throw new Error(
            'Permission denied',
        );

    }

    return CalendarServiceInstance.restore(id);

}

export async function updateCalendarEventStatus(
    id: string,
    status: CalendarStatus,
) {

    if (!can('update')) {

        throw new Error(
            'Permission denied',
        );

    }

    return CalendarServiceInstance.updateStatus(
        id,
        status,
    );

}

export async function getCalendarSummary() {

    return CalendarServiceInstance.summary();

}