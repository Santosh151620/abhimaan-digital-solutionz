import type {
    Report,
    ReportStatus,
} from '@/types/crm/Reports';

import {
    ReportRepositoryInstance,
} from '@/repositories/crm/ReportRepository';

class ReportService {

    list(): Report[] {

        return ReportRepositoryInstance.list();

    }

    listArchived(): Report[] {

        return ReportRepositoryInstance.listArchived();

    }

    details(
        id: string
    ): Report | null {

        return ReportRepositoryInstance.details(
            id
        );

    }

    findById(
        id: string
    ): Report | null {

        return ReportRepositoryInstance.findById(
            id
        );

    }

    create(
        data: Partial<Report>
    ): Report {

        return ReportRepositoryInstance.create(
            data
        );

    }

    update(
        id: string,
        data: Partial<Report>
    ): Report | null {

        return ReportRepositoryInstance.update(
            id,
            data
        );

    }

    updateStatus(
        id: string,
        status: ReportStatus
    ) {

        return ReportRepositoryInstance.updateStatus(
            id,
            status
        );
    }

    delete(
        id: string
    ): boolean {

        return ReportRepositoryInstance.delete(
            id
        );

    }



    restore(
        id: string
    ): boolean {

        return ReportRepositoryInstance.restore(
            id
        );

    }
    summary() {

        return ReportRepositoryInstance.summary();

    }
}

export const ReportServiceInstance =
    new ReportService();

export const ReportsServiceInstance =
    ReportServiceInstance;