import Link from 'next/link';
import {
    notFound,
} from 'next/navigation';

import {
    ReportsForm,
} from '@/components/crm/reports';

import {
    getReport,
} from '../../actions';

interface Props {

    params: Promise<{
        id: string;
    }>;

}

export default async function EditReportPage({
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
                    Edit Report
                </h1>

                <Link
                    href={`/crm/reports/${id}`}
                    className="rounded-lg border px-4 py-2"
                >
                    Cancel
                </Link>

            </div>

            <ReportsForm
                initialValues={report}
                onSubmit={async () => {}}
            />

        </div>

    );

}