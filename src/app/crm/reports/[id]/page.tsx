import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
    getReport,
} from '../actions';

interface Props {

    params: Promise<{
        id: string;
    }>;

}

export default async function ReportDetailsPage({
    params,
}: Props) {

    const { id } =
        await params;

    const report =
        await getReport(id);

    if (!report) {

        notFound();

    }

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <h1 className="text-2xl font-semibold">
                    {report.title}
                </h1>

                <Link
                    href={`/crm/reports/${report.id}/edit`}
                    className="rounded-lg border px-4 py-2"
                >
                    Edit
                </Link>

            </div>

            <div className="rounded-xl border p-6 space-y-4">

                <div>

                    <div className="text-sm text-muted-foreground">
                        Report Number
                    </div>

                    <div className="font-medium">
                        {report.reportNumber}
                    </div>

                </div>

                <div>

                    <div className="text-sm text-muted-foreground">
                        Category
                    </div>

                    <div>
                        {report.category}
                    </div>

                </div>

                <div>

                    <div className="text-sm text-muted-foreground">
                        Status
                    </div>

                    <div>
                        {report.status}
                    </div>

                </div>

                <div>

                    <div className="text-sm text-muted-foreground">
                        Format
                    </div>

                    <div>
                        {report.format}
                    </div>

                </div>

                <div>

                    <div className="text-sm text-muted-foreground">
                        Description
                    </div>

                    <div>
                        {report.description || '-'}
                    </div>

                </div>

            </div>

        </div>

    );

}