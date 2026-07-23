'use client';

import { useState } from 'react';

import type {
    KnowledgeArticle,
    KnowledgeCategory,
    KnowledgeStatus,
} from '@/types/crm/KnowledgeBase';

interface Props {

    initialValues?: Partial<KnowledgeArticle>;

    loading?: boolean;

    onSubmit?: (
        values: Partial<KnowledgeArticle>,
    ) => void | Promise<void>;

    onCancel?: () => void;

}

const categories: KnowledgeCategory[] = [
    'General',
    'Sales',
    'Marketing',
    'Projects',
    'Support',
    'Finance',
    'HR',
    'Technical',
    'Administration',
    'Other',
];

const statuses: KnowledgeStatus[] = [
    'Draft',
    'Published',
    'Archived',
];

export default function KnowledgeBaseForm({
    initialValues,
    loading = false,
    onSubmit,
    onCancel,
}: Props) {

    const [form, setForm] =
        useState<Partial<KnowledgeArticle>>({

            category: 'General',

            status: 'Draft',

            tags: [],

            featured: false,

            ...initialValues,

        });

    function update<
        K extends keyof KnowledgeArticle,
    >(
        key: K,
        value: KnowledgeArticle[K],
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
                'Title is required.',
            );

            return;

        }

        if (!form.content?.trim()) {

            alert(
                'Content is required.',
            );

            return;

        }

        await onSubmit?.(form);

    }

    return (

        <form
            onSubmit={submit}
            className="space-y-6 rounded-xl border bg-background p-6"
        >

            <div className="grid gap-4 md:grid-cols-2">

                <div>

                    <label className="mb-1 block text-sm font-medium">
                        Title
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
                                e.target
                                    .value as KnowledgeCategory,
                            )
                        }
                    >

                        {categories.map(category => (

                            <option
                                key={category}
                                value={category}
                            >
                                {category}
                            </option>

                        ))}

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
                                e.target
                                    .value as KnowledgeStatus,
                            )
                        }
                    >

                        {statuses.map(status => (

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

                    <label className="mb-1 block text-sm font-medium">
                        Author
                    </label>

                    <input
                        className="w-full rounded-lg border p-2"
                        value={form.author ?? ''}
                        onChange={e =>
                            update(
                                'author',
                                e.target.value,
                            )
                        }
                    />

                </div>

                <div className="md:col-span-2">

                    <label className="mb-1 block text-sm font-medium">
                        Summary
                    </label>

                    <textarea
                        rows={3}
                        className="w-full rounded-lg border p-2"
                        value={form.summary ?? ''}
                        onChange={e =>
                            update(
                                'summary',
                                e.target.value,
                            )
                        }
                    />

                </div>

                <div className="md:col-span-2">

                    <label className="mb-1 block text-sm font-medium">
                        Content
                    </label>

                    <textarea
                        rows={10}
                        className="w-full rounded-lg border p-2"
                        value={form.content ?? ''}
                        onChange={e =>
                            update(
                                'content',
                                e.target.value,
                            )
                        }
                    />

                </div>

                <div className="md:col-span-2">

                    <label className="flex items-center gap-2">

                        <input
                            type="checkbox"
                            checked={
                                form.featured ??
                                false
                            }
                            onChange={e =>
                                update(
                                    'featured',
                                    e.target.checked,
                                )
                            }
                        />

                        Featured Article

                    </label>

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
                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                >
                    {
                        loading
                            ? 'Saving...'
                            : 'Save Article'
                    }
                </button>

            </div>

        </form>

    );

}