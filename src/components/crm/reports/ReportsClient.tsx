'use client';

import {
    useMemo,
} from 'react';

import ReportsDashboard from './ReportsDashboard';

import {
    ReportServiceInstance,
} from '@/services/crm/ReportService';


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



function mapReportType(
    category: string,
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
                    ReportServiceInstance.list();


                return source.map(
                    report =>
                        ({

                            id:
                                report.id,


                            name:
                                report.title,


                            type:
                                mapReportType(
                                    report.category,
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


                        } satisfies DashboardReport),
                );

            },
            [],
        );



    return (

        <ReportsDashboard
            reports={reports}
        />

    );

}