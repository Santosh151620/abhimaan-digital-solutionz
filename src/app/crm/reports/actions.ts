'use server';

import {
    ReportServiceInstance,
} from '@/services/crm/ReportsService';

import {
    PermissionServiceInstance,
} from '@/services/crm/PermissionService';

import {
    CRM_ADMIN_ROLE,
} from '@/services/crm/crmPermissions';

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


async function getReports() {

    return ReportServiceInstance.list();

}


async function getArchivedReports() {

    return ReportServiceInstance.listArchived();

}


export async function getReport(
    id: string,
) {

    return ReportServiceInstance.details(
        id,
    );

}


async function createReport(
    data: Partial<Report>,
) {

    if (!can('create')) {

        throw new Error(
            'Permission denied',
        );

    }


    return ReportServiceInstance.create(
        data,
    );

}


async function updateReport(
    id: string,
    data: Partial<Report>,
) {

    if (!can('update')) {

        throw new Error(
            'Permission denied',
        );

    }


    return ReportServiceInstance.update(
        id,
        data,
    );

}


async function deleteReport(
    id: string,
) {

    if (!can('delete')) {

        throw new Error(
            'Permission denied',
        );

    }


    return ReportServiceInstance.delete(
        id,
    );

}


async function restoreReport(
    id: string,
) {

    if (!can('update')) {

        throw new Error(
            'Permission denied',
        );

    }


    return ReportServiceInstance.restore(
        id,
    );

}


async function updateReportStatus(
    id: string,
    status: ReportStatus,
) {

    if (!can('update')) {

        throw new Error(
            'Permission denied',
        );

    }


    return ReportServiceInstance.updateStatus(
        id,
        status,
    );

}


async function getReportsSummary() {

    return ReportServiceInstance.summary();

}

