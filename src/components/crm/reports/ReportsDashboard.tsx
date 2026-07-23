import type {
    Report,
} from '@/types/crm/Report';

interface Props {

    reports: Report[];

}

export default function ReportsDashboard({
    reports,
}: Props) {

    return (

        <div className="grid gap-4 md:grid-cols-3">

            <div className="rounded-lg border p-4">

                <div className="text-sm text-muted-foreground">
                    Total Reports
                </div>

                <div className="text-2xl font-semibold">
                    {reports.length}
                </div>

            </div>


            <div className="rounded-lg border p-4">

                <div className="text-sm text-muted-foreground">
                    Generated Records
                </div>

                <div className="text-2xl font-semibold">

                    {
                        reports.reduce(
                            (
                                total,
                                report
                            ) =>
                                total +
                                report.totalRecords,
                            0
                        )
                    }

                </div>

            </div>


            <div className="rounded-lg border p-4">

                <div className="text-sm text-muted-foreground">
                    Latest Report
                </div>

                <div className="text-sm font-medium">

                    {
                        reports.at(-1)?.name ??
                        'No reports'
                    }

                </div>

            </div>

        </div>

    );

}