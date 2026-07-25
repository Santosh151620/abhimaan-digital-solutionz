export type ReportType =
    | 'Sales'
    | 'Leads'
    | 'Revenue'
    | 'Projects'
    | 'Tasks'
    | 'Activities'
    | 'Custom';

export interface Report {

    id: string;

    name: string;

    type: ReportType;

    description?: string;

    generatedAt: string;

    generatedBy?: string;

    totalRecords: number;

}