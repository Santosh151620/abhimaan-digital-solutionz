'use client';

import { useState } from 'react';
import type { Company } from '@/types/crm/Companies';

interface CompaniesFormProps {
    initialValues?: Partial<Company>;
    onSubmit?: (values: Partial<Company>) => void | Promise<void>;
    onCancel?: () => void;
    loading?: boolean;
}

export function CompaniesForm({
    initialValues,
    onSubmit,
    onCancel,
    loading = false,
}: CompaniesFormProps) {
    const [form, setForm] = useState<Partial<Company>>({
        status: 'ACTIVE',
        ...initialValues,
    });

    function update<K extends keyof Company>(
        key: K,
        value: Company[K]
    ) {
        setForm((previous) => ({
            ...previous,
            [key]: value,
        }));
    }

    async function submit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!form.name?.trim()) {
            alert('Company name is required.');
            return;
        }

        await onSubmit?.(form);
    }

    return (
        <form
            onSubmit={submit}
            className="space-y-6 rounded-xl border bg-background p-6"
        >
            <div>
                <h2 className="text-xl font-semibold">
                    Company Details
                </h2>

                <p className="text-sm text-muted-foreground">
                    Create or update a company.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Company Name *
                    </label>

                    <input
                        className="w-full rounded-lg border px-3 py-2"
                        value={form.name ?? ''}
                        onChange={(e) =>
                            update('name', e.target.value)
                        }
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Legal Name
                    </label>

                    <input
                        className="w-full rounded-lg border px-3 py-2"
                        value={form.legalName ?? ''}
                        onChange={(e) =>
                            update('legalName', e.target.value)
                        }
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Industry
                    </label>

                    <input
                        className="w-full rounded-lg border px-3 py-2"
                        value={form.industry ?? ''}
                        onChange={(e) =>
                            update('industry', e.target.value)
                        }
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Status
                    </label>

                    <select
                        className="w-full rounded-lg border px-3 py-2"
                        value={form.status ?? 'ACTIVE'}
                        onChange={(e) =>
                            update(
                                'status',
                                e.target.value as Company['status']
                            )
                        }
                    >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="PROSPECT">PROSPECT</option>
                        <option value="INACTIVE">INACTIVE</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Website
                    </label>

                    <input
                        className="w-full rounded-lg border px-3 py-2"
                        value={form.website ?? ''}
                        onChange={(e) =>
                            update('website', e.target.value)
                        }
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Email
                    </label>

                    <input
                        type="email"
                        className="w-full rounded-lg border px-3 py-2"
                        value={form.email ?? ''}
                        onChange={(e) =>
                            update('email', e.target.value)
                        }
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Phone
                    </label>

                    <input
                        className="w-full rounded-lg border px-3 py-2"
                        value={form.phone ?? ''}
                        onChange={(e) =>
                            update('phone', e.target.value)
                        }
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Employees
                    </label>

                    <input
                        type="number"
                        className="w-full rounded-lg border px-3 py-2"
                        value={form.employees ?? ''}
                        onChange={(e) =>
                            update(
                                'employees',
                                Number(e.target.value)
                            )
                        }
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium">
                        Address
                    </label>

                    <input
                        className="w-full rounded-lg border px-3 py-2"
                        value={form.address ?? ''}
                        onChange={(e) =>
                            update('address', e.target.value)
                        }
                    />
                </div>

            </div>

            <div className="flex justify-end gap-3">

                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg border px-4 py-2"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-primary px-5 py-2 font-medium text-primary-foreground disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save Company'}
                </button>

            </div>
        </form>
    );
}