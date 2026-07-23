import {
    ReportsRepositoryInstance,
} from '@/repositories/crm/ReportsRepository';

import type {
    Report,
    ReportStatus,
} from '@/types/crm/Reports';

class ReportsService {

    list() {

        return ReportsRepositoryInstance.list();

    }

    listArchived() {

        return ReportsRepositoryInstance.listArchived();

    }

    details(
        id: string,
    ) {

        return ReportsRepositoryInstance.details(
            id,
        );

    }

    create(
        data: Partial<Report>,
    ) {

        return ReportsRepositoryInstance.create(
            data,
        );

    }

    update(
        id: string,
        data: Partial<Report>,
    ) {

        return ReportsRepositoryInstance.update(
            id,
            data,
        );

    }

    updateStatus(
        id: string,
        status: ReportStatus,
    ) {

        return ReportsRepositoryInstance.updateStatus(
            id,
            status,
        );

    }

    delete(
        id: string,
    ) {

        return ReportsRepositoryInstance.delete(
            id,
        );

    }

    restore(
        id: string,
    ) {

        return ReportsRepositoryInstance.restore(
            id,
        );

    }

    summary() {

        return ReportsRepositoryInstance.summary();

    }

}

export async function createReportsService() {

    return new ReportsService();

}

export const ReportsServiceInstance =
    new ReportsService();