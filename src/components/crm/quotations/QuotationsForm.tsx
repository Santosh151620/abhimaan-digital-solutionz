'use client';

import type { Quotation } from '@/types/crm/Quotations';

type Props = {
    quotation?: Quotation;
    action?: (formData: FormData) => void | Promise<void>;
};

export default function QuotationsForm({
    quotation,
    action,
}: Props) {
    return (
        <form action={action} className="space-y-4">

            <input
                name="title"
                defaultValue={quotation?.title ?? ''}
                placeholder="Title"
                className="border rounded p-2 w-full"
            />

            <input
                name="customerName"
                defaultValue={quotation?.customerName ?? ''}
                placeholder="Customer"
                className="border rounded p-2 w-full"
            />

            <input
                name="amount"
                type="number"
                defaultValue={quotation?.amount ?? 0}
                placeholder="Amount"
                className="border rounded p-2 w-full"
            />

            <input
                name="currency"
                defaultValue={quotation?.currency ?? 'INR'}
                className="border rounded p-2 w-full"
            />

            <input
                name="validUntil"
                defaultValue={quotation?.validUntil ?? ''}
                className="border rounded p-2 w-full"
            />

            <select
                name="status"
                defaultValue={quotation?.status ?? 'Draft'}
                className="border rounded p-2 w-full"
            >
                <option>Draft</option>
                <option>Sent</option>
                <option>Accepted</option>
                <option>Rejected</option>
            </select>

            <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-white"
            >
                Save
            </button>

        </form>
    );
}