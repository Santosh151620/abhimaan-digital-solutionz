'use client';

import type {
    Invoice,
    InvoiceStatus,
} from '@/types/crm/Invoices';

interface Props {
    initialData?: Partial<Invoice>;
    action: (formData: FormData) => void | Promise<void>;
}

const statuses: InvoiceStatus[] = [
    'Draft',
    'Sent',
    'Paid',
    'Overdue',
    'Cancelled',
];

export default function InvoicesForm({
    initialData,
    action,
}: Props) {

    return (

        <form
            action={action}
            className="space-y-6 rounded-xl border bg-card p-6"
        >

            <div className="grid gap-6 md:grid-cols-2">

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Invoice Number
                    </label>

                    <input
                        name="invoiceNumber"
                        defaultValue={initialData?.invoiceNumber}
                        required
                        className="w-full rounded-lg border px-3 py-2"
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Title
                    </label>

                    <input
                        name="title"
                        defaultValue={initialData?.title}
                        required
                        className="w-full rounded-lg border px-3 py-2"
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Customer Name
                    </label>

                    <input
                        name="customerName"
                        defaultValue={initialData?.title}
                        required
                        className="w-full rounded-lg border px-3 py-2"
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Company ID
                    </label>

                    <input
                        name="companyId"
                        defaultValue={initialData?.companyId}
                        className="w-full rounded-lg border px-3 py-2"
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Issue Date
                    </label>

                    <input
                        type="date"
                        name="issueDate"
                        defaultValue={initialData?.issueDate}
                        className="w-full rounded-lg border px-3 py-2"
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Due Date
                    </label>

                    <input
                        type="date"
                        name="dueDate"
                        defaultValue={initialData?.dueDate}
                        className="w-full rounded-lg border px-3 py-2"
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Amount
                    </label>

                    <input
                        type="number"
                        step="0.01"
                        name="total"
                        defaultValue={initialData?.total}
                        className="w-full rounded-lg border px-3 py-2"
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Currency
                    </label>

                    <input
                        name="currency"
                        defaultValue={initialData?.currency ?? 'INR'}
                        className="w-full rounded-lg border px-3 py-2"
                    />

                </div>

                <div className="md:col-span-2">

                    <label className="mb-2 block text-sm font-medium">
                        Status
                    </label>

                    <select
                        name="status"
                        defaultValue={initialData?.status ?? 'Draft'}
                        className="w-full rounded-lg border px-3 py-2"
                    >
                        {statuses.map((status) => (
                            <option
                                key={status}
                                value={status}
                            >
                                {status}
                            </option>
                        ))}
                    </select>

                </div>

                <div className="md:col-span-2">

                    <label className="mb-2 block text-sm font-medium">
                        Notes
                    </label>

                    <textarea
                        rows={5}
                        name="notes"
                        defaultValue={initialData?.notes}
                        className="w-full rounded-lg border px-3 py-2"
                    />

                </div>

            </div>

            <div className="flex justify-end">

                <button
                    type="submit"
                    className="rounded-lg bg-primary px-6 py-2 text-primary-foreground"
                >
                    Save Invoice
                </button>

            </div>

        </form>

    );

}