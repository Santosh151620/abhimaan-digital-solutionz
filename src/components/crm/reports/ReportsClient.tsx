'use client';

import {
    useMemo,
} from 'react';

import ReportsDashboard from './ReportsDashboard';

import {
    ReportsServiceInstance,
} from '@/services/crm/ReportService';

import type {
    Report as DashboardReport,
    ReportType,
} from '@/types/crm/Report';


function mapReportType(
    category: string
): ReportType {

    switch (category) {

        case 'Sales':
            return 'Sales';

        case 'Projects':
            return 'Projects';

        case 'Tasks':
            return 'Tasks';

        case 'Marketing':
            return 'Leads';

        case 'Customers':
            return 'Leads';

        case 'Finance':
            return 'Revenue';

        case 'Operations':
            return 'Activities';

        default:
            return 'Custom';

    }

}



export default function ReportsClient() {


    const reports =
        useMemo(
            () => {

                const source =
                    ReportsServiceInstance.list();



                return source.map(
                    report =>
                        ({

                            id:
                                report.id,


                            name:
                                report.title,


                            type:
                                mapReportType(
                                    report.category
                                ),


                            description:
                                report.description,


                            generatedAt:
                                report.generatedAt ??
                                report.createdAt,


                            generatedBy:
                                report.generatedBy,


                            totalRecords:
                                0,


                        } satisfies DashboardReport)
                );


            },
            []
        );



    return (

        <ReportsDashboard
            reports={reports}
        />

    );

}