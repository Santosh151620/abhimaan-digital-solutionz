import Link from 'next/link';

import {
    ReportsForm,
} from '@/components/crm/reports';

export default function NewReportPage() {

    return (

        <div className="space-y-6">

            <h1 className="text-2xl font-semibold">
                Create Report
            </h1>

            <ReportsForm />

            <Link
                href="/crm/reports"
                className="text-sm underline"
            >
                Back to Reports
            </Link>

        </div>

    );

}
