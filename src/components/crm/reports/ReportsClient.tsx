'use client';

import {
    useState,
} from 'react';

import {
    ReportsForm,
    ReportsSummary,
    ReportsTable,
} from './index';

import type {
    Report,
    ReportSummary,
} from '@/types/crm/Reports';

interface Props {

    initialReports: Report[];

    summary: ReportSummary;

}

export default function ReportsClient({
    initialReports,
    summary,
}: Props) {

    const [reports, setReports] =
        useState<Report[]>(
            initialReports,
        );

    const [showForm, setShowForm] =
        useState(false);

    async function createReport(
        values: Partial<Report>,
    ) {

        const now =
            new Date().toISOString();

        const report: Report = {

            id:
                crypto.randomUUID(),

            reportNumber:
                `RPT-${Date.now()}`,

            companyId:
                values.companyId,

            title:
                values.title ?? '',

            description:
                values.description,

            category:
                values.category ?? 'CRM',

            format:
                values.format ?? 'Dashboard',

            status:
                values.status ?? 'Draft',

            filters:
                typeof values.filters === 'string'
                    ? JSON.parse(values.filters)
                    : values.filters ?? {},

            schedule:
                values.schedule,

            lastRunAt:
                values.lastRunAt,

            shared:
                values.shared ?? false,

            archived:
                false,

            createdAt:
                now,

            updatedAt:
                now,

        };

        setReports(previous => [

            ...previous,

            report,

        ]);

        setShowForm(false);

    }

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <h1 className="text-2xl font-semibold">
                    Reports
                </h1>

                <button
                    onClick={() => setShowForm(true)}
                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                >
                    New Report
                </button>

            </div>

            <ReportsSummary
                summary={summary}
            />

            {
                showForm && (

                    <ReportsForm
                        onSubmit={createReport}
                        onCancel={() =>
                            setShowForm(false)
                        }
                    />

                )
            }

            <ReportsTable
                reports={reports}
            />

        </div>

    );

}