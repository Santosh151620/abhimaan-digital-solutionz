import Link from 'next/link';
import { notFound } from 'next/navigation';

import { QuotationsServiceInstance } from '@/services/crm/QuotationsService';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function QuotationDetailsPage({
    params,
}: Props) {

    const { id } = await params;

    const quotation =
        await QuotationsServiceInstance.details(id);

    if (!quotation) {
        notFound();
    }

    return (

        <div className="">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-bold">
                        {quotation.title}
                    </h1>

                    <p className="text-gray-500">
                        {quotation.customerName}
                    </p>

                </div>

                <Link
                    href={`/crm/quotations/${id}/edit`}
                    className="rounded-lg border px-4 py-2"
                >
                    Edit
                </Link>

            </div>

            <div className="rounded-xl border p-6 space-y-3">

                <p>
                    <strong>Customer:</strong> {quotation.customerName}
                </p>

                <p>
                    <strong>Amount:</strong> {quotation.currency} {quotation.amount}
                </p>

                <p>
                    <strong>Status:</strong> {quotation.status}
                </p>

                <p>
                    <strong>Valid Until:</strong> {quotation.validUntil}
                </p>

                <p>
                    <strong>Created:</strong> {quotation.createdAt}
                </p>

            </div>

        </div>

    );

}