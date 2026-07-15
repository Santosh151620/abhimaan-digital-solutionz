import Link from 'next/link';
import { notFound } from 'next/navigation';

import { OpportunitiesServiceInstance } from '@/services/crm/OpportunitiesService';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function OpportunityDetailsPage({
    params,
}: Props) {

    const { id } = await params;

    const opportunity =
        await OpportunitiesServiceInstance.details(id);

    if (!opportunity) {
        notFound();
    }

    return (

        <div className="space-y-6">

            <div className="flex justify-between">

                <h1 className="text-2xl font-bold">
                    {opportunity.title}
                </h1>

                <Link
                    href={`/crm/opportunities/${id}/edit`}
                    className="rounded-lg border px-4 py-2"
                >
                    Edit
                </Link>

            </div>

            <div className="rounded-xl border p-6 space-y-3">

                <p><strong>Company:</strong> {opportunity.companyId}</p>
                <p><strong>Stage:</strong> {opportunity.stage}</p>
                <p><strong>Value:</strong> ₹ {opportunity.value}</p>
                <p><strong>Probability:</strong> {opportunity.probability}%</p>
                <p><strong>Expected Close:</strong> {opportunity.expectedCloseDate}</p>

            </div>

        </div>

    );

}