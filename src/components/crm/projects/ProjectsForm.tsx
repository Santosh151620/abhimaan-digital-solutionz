'use client';

import type {
    Project,
    ProjectStatus,
} from '@/types/crm/Projects';

interface Props {
    initialData?: Partial<Project>;
    action: (
        formData: FormData
    ) =>
        void |
        Promise<unknown>;
}

const statuses: ProjectStatus[] = [
    'Planning',
    'Active',
    'On Hold',
    'Completed',
    'Cancelled',
];

export default function ProjectsForm({
    initialData,
    action,
}: Props) {

    return (

        <form
            action={
                action
                    ? async (formData) => {
                          await action(formData);
                      }
                    : undefined
            }
            className="space-y-6 rounded-xl border bg-white p-6"
        >

            <div className="grid gap-6 md:grid-cols-2">

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Project Number
                    </label>

                    <input
                        name="projectNumber"
                        defaultValue={initialData?.projectNumber}
                        required
                        className="w-full rounded-lg border px-3 py-2"
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Project Name
                    </label>

                    <input
                        name="name"
                        defaultValue={initialData?.name}
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
                        defaultValue={initialData?.customerName}
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
                        Contract ID
                    </label>

                    <input
                        name="contractId"
                        defaultValue={initialData?.contractId}
                        className="w-full rounded-lg border px-3 py-2"
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Project Manager
                    </label>

                    <input
                        name="manager"
                        defaultValue={initialData?.manager}
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
                        Budget
                    </label>

                    <input
                        type="number"
                        step="0.01"
                        name="budget"
                        defaultValue={initialData?.budget}
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
                            initialData?.status ?? 'Planning'
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
                        Description
                    </label>

                    <textarea
                        rows={6}
                        name="description"
                        defaultValue={initialData?.description}
                        className="w-full rounded-lg border px-3 py-2"
                    />

                </div>

            </div>

            <div className="flex justify-end">

                <button
                    type="submit"
                    className="rounded-lg bg-primary px-6 py-2 text-primary-foreground"
                >
                    Save Project
                </button>

            </div>

        </form>

    );

}