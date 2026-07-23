'use client';

import { useState } from 'react';

import type {
    Setting,
    SettingCategory,
    SettingStatus,
} from '@/types/crm/Settings';

interface Props {

    initialValues?: Partial<Setting>;

    loading?: boolean;

    onSubmit?: (
        values: Partial<Setting>
    ) => void | Promise<void>;

    onCancel?: () => void;

}

const categories: SettingCategory[] = [
    'General',
    'Company',
    'CRM',
    'Notifications',
    'Security',
    'Billing',
    'Email',
    'Integrations',
    'Appearance',
    'Other',
];

const statuses: SettingStatus[] = [
    'Active',
    'Inactive',
];

export default function SettingsForm({
    initialValues,
    loading = false,
    onSubmit,
    onCancel,
}: Props) {

    const [form, setForm] =
        useState<Partial<Setting>>({

            category: 'General',

            status: 'Active',

            editable: true,

            encrypted: false,

            ...initialValues,

        });

    function update<K extends keyof Setting>(
        key: K,
        value: Setting[K],
    ) {

        setForm(previous => ({
            ...previous,
            [key]: value,
        }));

    }

    async function submit(
        e: React.FormEvent<HTMLFormElement>,
    ) {

        e.preventDefault();

        if (!form.name?.trim()) {

            alert(
                'Setting name is required.'
            );

            return;

        }

        if (!form.key?.trim()) {

            alert(
                'Setting key is required.'
            );

            return;

        }

        await onSubmit?.(
            form
        );

    }

    return (

        <form
            onSubmit={submit}
            className="space-y-6 rounded-xl border bg-background p-6"
        >

            <div className="grid gap-4 md:grid-cols-2">

                <div>

                    <label className="mb-1 block text-sm font-medium">
                        Name
                    </label>

                    <input
                        className="w-full rounded-lg border p-2"
                        value={form.name ?? ''}
                        onChange={e =>
                            update(
                                'name',
                                e.target.value,
                            )
                        }
                    />

                </div>

                <div>

                    <label className="mb-1 block text-sm font-medium">
                        Key
                    </label>

                    <input
                        className="w-full rounded-lg border p-2"
                        value={form.key ?? ''}
                        onChange={e =>
                            update(
                                'key',
                                e.target.value,
                            )
                        }
                    />

                </div>

                <div>

                    <label className="mb-1 block text-sm font-medium">
                        Category
                    </label>

                    <select
                        className="w-full rounded-lg border p-2"
                        value={form.category}
                        onChange={e =>
                            update(
                                'category',
                                e.target.value as SettingCategory,
                            )
                        }
                    >

                        {
                            categories.map(category => (

                                <option
                                    key={category}
                                    value={category}
                                >
                                    {category}
                                </option>

                            ))
                        }

                    </select>

                </div>

                <div>

                    <label className="mb-1 block text-sm font-medium">
                        Status
                    </label>

                    <select
                        className="w-full rounded-lg border p-2"
                        value={form.status}
                        onChange={e =>
                            update(
                                'status',
                                e.target.value as SettingStatus,
                            )
                        }
                    >

                        {
                            statuses.map(status => (

                                <option
                                    key={status}
                                    value={status}
                                >
                                    {status}
                                </option>

                            ))
                        }

                    </select>

                </div>

                <div className="md:col-span-2">

                    <label className="mb-1 block text-sm font-medium">
                        Value
                    </label>

                    <textarea
                        rows={5}
                        className="w-full rounded-lg border p-2"
                        value={form.value ?? ''}
                        onChange={e =>
                            update(
                                'value',
                                e.target.value,
                            )
                        }
                    />

                </div>

                <div className="md:col-span-2">

                    <label className="mb-1 block text-sm font-medium">
                        Description
                    </label>

                    <textarea
                        rows={3}
                        className="w-full rounded-lg border p-2"
                        value={form.description ?? ''}
                        onChange={e =>
                            update(
                                'description',
                                e.target.value,
                            )
                        }
                    />

                </div>

                <label className="flex items-center gap-2">

                    <input
                        type="checkbox"
                        checked={form.editable ?? true}
                        onChange={e =>
                            update(
                                'editable',
                                e.target.checked,
                            )
                        }
                    />

                    Editable

                </label>

                <label className="flex items-center gap-2">

                    <input
                        type="checkbox"
                        checked={form.encrypted ?? false}
                        onChange={e =>
                            update(
                                'encrypted',
                                e.target.checked,
                            )
                        }
                    />

                    Encrypted

                </label>

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
                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                >
                    {
                        loading
                            ? 'Saving...'
                            : 'Save Setting'
                    }
                </button>

            </div>

        </form>

    );

}