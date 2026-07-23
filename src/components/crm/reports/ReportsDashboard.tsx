'use client';

import {
    ReportsSummary,
    ReportsTable,
} from './index';


type ReportType =
    | 'Sales'
    | 'Leads'
    | 'Revenue'
    | 'Projects'
    | 'Tasks'
    | 'Activities'
    | 'Custom';


export interface DashboardReport {

    id: string;

    name: string;

    type: ReportType;

    description?: string;

    generatedAt: string;

    generatedBy?: string;

    totalRecords: number;

}


interface Props {

    reports: DashboardReport[];

}



export default function ReportsDashboard({
    reports,
}: Props) {


    const summary = {

        total:
            reports.length,

        published:
            reports.length,

        draft:
            0,

        archived:
            0,

        scheduled:
            0,

        shared:
            0,

    };


    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-2xl font-semibold">
                    Reports
                </h1>

                <p className="text-muted-foreground">
                    Business reporting and intelligence dashboard.
                </p>

            </div>


            <ReportsSummary
                summary={summary}
            />


            <ReportsTable
                reports={reports}
            />

        </div>

    );

}