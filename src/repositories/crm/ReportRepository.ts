import type {
    Report,
    ReportStatus,
} from '@/types/crm/Reports';


class ReportRepository {


    private reports =
        new Map<string, Report>();


    list(): Report[] {

        return Array.from(
            this.reports.values()
        )
        .filter(
            report =>
                !report.archived
        );

    }



    listArchived(): Report[] {

        return Array.from(
            this.reports.values()
        )
        .filter(
            report =>
                report.archived
        );

    }



    details(
        id: string
    ): Report | null {

        return this.reports.get(id) ?? null;

    }



    findById(
        id: string
    ): Report | null {

        return this.details(id);

    }



    create(
        data: Partial<Report>
    ): Report {


        const now =
            new Date().toISOString();


        const report: Report = {


            id:
                crypto.randomUUID(),


            reportNumber:
                data.reportNumber ??
                `RPT-${Date.now()}`,


            companyId:
                data.companyId,


            title:
                data.title ?? '',


            description:
                data.description,


            category:
                data.category ?? 'CRM',


            format:
                data.format ?? 'Table',


            status:
                data.status ?? 'Draft',


            filters:
                data.filters,


            generatedAt:
                data.generatedAt,


            generatedBy:
                data.generatedBy,


            lastRunAt:
                data.lastRunAt,


            schedule:
                data.schedule,


            shared:
                data.shared ?? false,


            archived:
                false,


            createdAt:
                now,


            updatedAt:
                now,


        };


        this.reports.set(
            report.id,
            report
        );


        return report;

    }



    update(
        id: string,
        data: Partial<Report>
    ): Report | null {


        const existing =
            this.reports.get(id);



        if (!existing) {

            return null;

        }



        const updated: Report = {


            ...existing,

            ...data,


            updatedAt:
                new Date().toISOString(),


        };



        this.reports.set(
            id,
            updated
        );



        return updated;

    }



    updateStatus(
        id: string,
        status: ReportStatus
    ) {

        return this.update(
            id,
            {
                status,
            }
        );

    }



    delete(
        id: string
    ): boolean {


        const report =
            this.reports.get(id);



        if (!report) {

            return false;

        }



        report.archived = true;

        report.updatedAt =
            new Date().toISOString();



        this.reports.set(
            id,
            report
        );



        return true;

    }



    restore(
        id: string
    ): boolean {


        const report =
            this.reports.get(id);



        if (!report) {

            return false;

        }



        report.archived = false;


        report.updatedAt =
            new Date().toISOString();



        this.reports.set(
            id,
            report
        );


        return true;

    }



    summary() {


        const reports =
            Array.from(
                this.reports.values()
            );



        return {


            total:
                reports.length,


            draft:
                reports.filter(
                    report =>
                        report.status === 'Draft'
                ).length,


            published:
                reports.filter(
                    report =>
                        report.status === 'Published'
                ).length,


            archived:
                reports.filter(
                    report =>
                        report.archived
                ).length,


            scheduled:
                reports.filter(
                    report =>
                        !!report.schedule
                ).length,


            shared:
                reports.filter(
                    report =>
                        report.shared
                ).length,


        };

    }


}



export const ReportRepositoryInstance =
    new ReportRepository();