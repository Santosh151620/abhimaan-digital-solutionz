'use client';

import type { Asset, AssetStatus } from '@/types/crm/Assets';

interface Props {
    initialData?: Partial<Asset>;
    action: (formData: FormData) => void | Promise<void>;
}

const statuses: AssetStatus[] = [
    'Available',
    'Allocated',
    'Maintenance',
    'Retired',
];

export default function AssetsForm({
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
                        Asset Code
                    </label>

                    <input
                        name="assetCode"
                        defaultValue={initialData?.assetCode}
                        className="w-full rounded-lg border px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Asset Name
                    </label>

                    <input
                        name="name"
                        defaultValue={initialData?.name}
                        className="w-full rounded-lg border px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Category
                    </label>

                    <input
                        name="category"
                        defaultValue={initialData?.category}
                        className="w-full rounded-lg border px-3 py-2"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Assigned To
                    </label>

                    <input
                        name="assignedTo"
                        defaultValue={initialData?.assignedTo}
                        className="w-full rounded-lg border px-3 py-2"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Purchase Date
                    </label>

                    <input
                        type="date"
                        name="purchaseDate"
                        defaultValue={initialData?.purchaseDate}
                        className="w-full rounded-lg border px-3 py-2"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Status
                    </label>

                    <select
                        name="status"
                        defaultValue={
                            initialData?.status ?? 'Available'
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

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Purchase Cost
                    </label>

                    <input
                        type="number"
                        step="0.01"
                        name="purchaseCost"
                        defaultValue={initialData?.purchaseCost}
                        className="w-full rounded-lg border px-3 py-2"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Current Value
                    </label>

                    <input
                        type="number"
                        step="0.01"
                        name="currentValue"
                        defaultValue={initialData?.currentValue}
                        className="w-full rounded-lg border px-3 py-2"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium">
                        Location
                    </label>

                    <input
                        name="location"
                        defaultValue={initialData?.location}
                        className="w-full rounded-lg border px-3 py-2"
                    />
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
                    Save Asset
                </button>
            </div>
        </form>
    );
}