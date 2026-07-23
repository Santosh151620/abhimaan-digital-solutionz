'use client';

import Link from 'next/link';

import type {
    Report,
} from '@/types/crm/Reports';

interface Props {

    reports: Report[];

}

export default function ReportsTable({
    reports,
}: Props) {

    if (reports.length === 0) {

        return (

            <div className="rounded-xl border p-8 text-center text-muted-foreground">
                No reports found.
            </div>

        );

    }

    return (

        <div className="overflow-x-auto rounded-xl border">

            <table className="w-full">

                <thead>

                    <tr className="border-b bg-muted/40 text-left">

                        <th className="p-3">
                            Report
                        </th>

                        <th className="p-3">
                            Category
                        </th>

                        <th className="p-3">
                            Format
                        </th>

                        <th className="p-3">
                            Status
                        </th>

                        <th className="p-3">
                            Shared
                        </th>

                        <th className="p-3">
                            Last Run
                        </th>

                        <th className="p-3 text-right">
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {
                        reports.map(report => (

                            <tr
                                key={report.id}
                                className="border-b hover:bg-muted/30"
                            >

                                <td className="p-3">

                                    <div className="font-medium">
                                        {report.title}
                                    </div>

                                    <div className="text-xs text-muted-foreground">
                                        {report.reportNumber}
                                    </div>

                                </td>

                                <td className="p-3">
                                    {report.category}
                                </td>

                                <td className="p-3">
                                    {report.format}
                                </td>

                                <td className="p-3">
                                    {report.status}
                                </td>

                                <td className="p-3">
                                    {
                                        report.shared
                                            ? 'Yes'
                                            : 'No'
                                    }
                                </td>

                                <td className="p-3">
                                    {
                                        report.lastRunAt
                                        ?? '-'
                                    }
                                </td>

                                <td className="p-3 text-right">

                                    <Link
                                        href={`/crm/reports/${report.id}`}
                                        className="rounded border px-3 py-1 text-sm"
                                    >
                                        View
                                    </Link>

                                </td>

                            </tr>

                        ))
                    }

                </tbody>

            </table>

        </div>

    );

}