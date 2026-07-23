'use server';

import {
    ReportsServiceInstance,
} from '@/services/crm/ReportService';

import {
    PermissionServiceInstance,
} from '@/services/crm/PermissionService';

import {
    CRM_ADMIN_ROLE,
} from '@/shared/crmPermissions';

import type {
    Report,
    ReportStatus,
} from '@/types/crm/Reports';


function can(
    action:
        | 'create'
        | 'update'
        | 'delete',
) {

    return PermissionServiceInstance.hasPermission(
        CRM_ADMIN_ROLE,
        'Report',
        action,
    );

}


export async function getReports() {

    return ReportsServiceInstance.list();

}


export async function getArchivedReports() {

    return ReportsServiceInstance.listArchived();

}


export async function getReport(
    id: string,
) {

    return ReportsServiceInstance.details(
        id,
    );

}


export async function createReport(
    data: Partial<Report>,
) {

    if (!can('create')) {

        throw new Error(
            'Permission denied',
        );

    }


    return ReportsServiceInstance.create(
        data,
    );

}


export async function updateReport(
    id: string,
    data: Partial<Report>,
) {

    if (!can('update')) {

        throw new Error(
            'Permission denied',
        );

    }


    return ReportsServiceInstance.update(
        id,
        data,
    );

}


export async function deleteReport(
    id: string,
) {

    if (!can('delete')) {

        throw new Error(
            'Permission denied',
        );

    }


    return ReportsServiceInstance.delete(
        id,
    );

}


export async function restoreReport(
    id: string,
) {

    if (!can('update')) {

        throw new Error(
            'Permission denied',
        );

    }


    return ReportsServiceInstance.restore(
        id,
    );

}


export async function updateReportStatus(
    id: string,
    status: ReportStatus,
) {

    if (!can('update')) {

        throw new Error(
            'Permission denied',
        );

    }


    return ReportsServiceInstance.updateStatus(
        id,
        status,
    );

}


export async function getReportsSummary() {

    return ReportsServiceInstance.summary();

}