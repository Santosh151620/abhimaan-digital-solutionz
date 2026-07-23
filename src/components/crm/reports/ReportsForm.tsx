'use client';

import {
    useState,
} from 'react';

import type {
    Report,
    ReportCategory,
    ReportFormat,
    ReportStatus,
} from '@/types/crm/Reports';

interface Props {

    initialValues?: Partial<Report>;

    loading?: boolean;

    onSubmit?: (
        values: Partial<Report>,
    ) => void | Promise<void>;

    onCancel?: () => void;

}

const categories: ReportCategory[] = [
    'Sales',
    'CRM',
    'Finance',
    'Projects',
    'Customers',
    'Marketing',
    'Operations',
    'Custom',
];

const formats: ReportFormat[] = [
    'Dashboard',
    'Table',
    'Chart',
    'PDF',
    'Excel',
];

const statuses: ReportStatus[] = [
    'Draft',
    'Published',
    'Archived',
];

export default function ReportsForm({
    initialValues,
    loading = false,
    onSubmit,
    onCancel,
}: Props) {

    const [form, setForm] =
        useState<Partial<Report>>({

            category: 'CRM',

            format: 'Dashboard',

            status: 'Draft',

            shared: false,

            ...initialValues,

        });

    function update<
        K extends keyof Report
    >(
        key: K,
        value: Report[K],
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

        if (!form.title?.trim()) {

            alert(
                'Report title is required.',
            );

            return;

        }

        await onSubmit?.(
            form,
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
                        Report Title
                    </label>

                    <input
                        className="w-full rounded-lg border p-2"
                        value={form.title ?? ''}
                        onChange={e =>
                            update(
                                'title',
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
                                e.target.value as ReportCategory,
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
                        Format
                    </label>

                    <select
                        className="w-full rounded-lg border p-2"
                        value={form.format}
                        onChange={e =>
                            update(
                                'format',
                                e.target.value as ReportFormat,
                            )
                        }
                    >

                        {
                            formats.map(format => (

                                <option
                                    key={format}
                                    value={format}
                                >
                                    {format}
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
                                e.target.value as ReportStatus,
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
                        Description
                    </label>

                    <textarea
                        rows={4}
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

                <label className="flex items-center gap-2 md:col-span-2">

                    <input
                        type="checkbox"
                        checked={form.shared ?? false}
                        onChange={e =>
                            update(
                                'shared',
                                e.target.checked,
                            )
                        }
                    />

                    Share Report

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
                            : 'Save Report'
                    }
                </button>

            </div>

        </form>

    );

}