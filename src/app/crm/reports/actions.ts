'use server';

import {
    ReportServiceInstance,
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

    return ReportServiceInstance.list();

}


export async function getArchivedReports() {

    return ReportServiceInstance.listArchived();

}


export async function getReport(
    id: string,
) {

    return ReportServiceInstance.details(
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


    return ReportServiceInstance.create(
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


    return ReportServiceInstance.update(
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


    return ReportServiceInstance.delete(
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


    return ReportServiceInstance.restore(
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


    return ReportServiceInstance.updateStatus(
        id,
        status,
    );

}


export async function getReportsSummary() {

    return ReportServiceInstance.summary();

}
