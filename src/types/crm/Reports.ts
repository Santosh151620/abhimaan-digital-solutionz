export type ReportCategory =
    | 'Sales'
    | 'CRM'
    | 'Finance'
    | 'Projects'
    | 'Customers'
    | 'Marketing'
    | 'Operations'
    | 'Custom';

export type ReportStatus =
    | 'Draft'
    | 'Published'
    | 'Archived';

export type ReportFormat =
    | 'Table'
    | 'Chart'
    | 'Dashboard'
    | 'PDF'
    | 'Excel';

export interface Report {

    id: string;

    reportNumber: string;

    companyId?: string;

    title: string;

    description?: string;

    category: ReportCategory;

    format: ReportFormat;

    status: ReportStatus;

    filters?: Record<
        string,
        unknown
    >;

    generatedAt?: string;

    generatedBy?: string;

    lastRunAt?: string;

    schedule?: string;

    shared: boolean;

    archived: boolean;

    createdAt: string;

    updatedAt: string;

}

export interface ReportSummary {

    total: number;

    draft: number;

    published: number;

    archived: number;

    scheduled: number;

    shared: number;

}