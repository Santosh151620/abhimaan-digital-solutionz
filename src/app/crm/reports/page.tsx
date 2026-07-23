import {
    ReportsClient,
} from '@/components/crm/reports';

import {
    getReports,
    getReportsSummary,
} from './actions';

export default async function ReportsPage() {

    const [
        reports,
        summary,
    ] = await Promise.all([

        getReports(),

        getReportsSummary(),

    ]);

    return (

        <ReportsClient

            initialReports={
                reports
            }

            summary={
                summary
            }

        />

    );

}