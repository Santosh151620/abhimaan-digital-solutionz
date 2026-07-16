'use client';

import type {
    Contract,
    ContractStatus,
} from '@/types/crm/Contracts';

interface Props {
    initialData?: Partial<Contract>;
    action: (formData: FormData) => void | Promise<void>;
}

const statuses: ContractStatus[] = [
    'Draft',
    'Pending',
    'Active',
    'Expired',
    'Terminated',
];

export default function ContractsForm({
    initialData,
    action,
}: Props) {

    return (

        <form
            action={action}
            className="space-y-6 rounded-xl border bg-white p-6"
        >

            <div className="grid gap-6 md:grid-cols-2">

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Contract Number
                    </label>

                    <input
                        name="contractNumber"
                        defaultValue={initialData?.contractNumber}
                        className="w-full rounded-lg border px-3 py-2"
                        required
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Title
                    </label>

                    <input
                        name="title"
                        defaultValue={initialData?.title}
                        className="w-full rounded-lg border px-3 py-2"
                        required
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Customer Name
                    </label>

                    <input
                        name="customerName"
                        defaultValue={initialData?.customerName}
                        className="w-full rounded-lg border px-3 py-2"
                        required
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
                        Start Date
                    </label>

                    <input
                        type="date"
                        name="startDate"
                        defaultValue={initialData?.startDate}
                        className="w-full rounded-lg border px-3 py-2"
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        End Date
                    </label>

                    <input
                        type="date"
                        name="endDate"
                        defaultValue={initialData?.endDate}
                        className="w-full rounded-lg border px-3 py-2"
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Contract Value
                    </label>

                    <input
                        type="number"
                        step="0.01"
                        name="value"
                        defaultValue={initialData?.value}
                        className="w-full rounded-lg border px-3 py-2"
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Currency
                    </label>

                    <input
                        name="currency"
                        defaultValue={
                            initialData?.currency ?? 'INR'
                        }
                        className="w-full rounded-lg border px-3 py-2"
                    />

                </div>

                <div className="md:col-span-2">

                    <label className="mb-2 block text-sm font-medium">
                        Status
                    </label>

                    <select
                        name="status"
                        defaultValue={
                            initialData?.status ?? 'Draft'
                        }
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
                    Save Contract
                </button>

            </div>

        </form>

    );

}