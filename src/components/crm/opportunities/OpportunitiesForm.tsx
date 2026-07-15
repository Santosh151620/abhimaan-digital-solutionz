'use client';

import { useState } from 'react';
import type { Opportunity } from '@/types/crm/Opportunities';

interface Props {
    initialValues?: Partial<Opportunity>;
    loading?: boolean;
    onSubmit?: (
        values: Partial<Opportunity>
    ) => void | Promise<void>;
    onCancel?: () => void;
}

export function OpportunitiesForm({
    initialValues,
    loading = false,
    onSubmit,
    onCancel,
}: Props) {

    const [form, setForm] =
        useState<Partial<Opportunity>>({
            stage: 'LEAD',
            probability: 0,
            value: 0,
            ...initialValues,
        });

    function update<K extends keyof Opportunity>(
        key: K,
        value: Opportunity[K],
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
            alert('Title is required.');
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

                <input
                    className="rounded-lg border p-2"
                    placeholder="Title"
                    value={form.title ?? ''}
                    onChange={e =>
                        update('title', e.target.value)
                    }
                />

                <input
                    className="rounded-lg border p-2"
                    placeholder="Company Id"
                    value={form.companyId ?? ''}
                    onChange={e =>
                        update('companyId', e.target.value)
                    }
                />

                <input
                    type="number"
                    className="rounded-lg border p-2"
                    placeholder="Value"
                    value={form.value ?? 0}
                    onChange={e =>
                        update(
                            'value',
                            Number(e.target.value),
                        )
                    }
                />

                <input
                    type="number"
                    className="rounded-lg border p-2"
                    placeholder="Probability"
                    value={form.probability ?? 0}
                    onChange={e =>
                        update(
                            'probability',
                            Number(e.target.value),
                        )
                    }
                />

                <select
                    className="rounded-lg border p-2"
                    value={form.stage}
                    onChange={e =>
                        update(
                            'stage',
                            e.target.value as Opportunity['stage'],
                        )
                    }
                >
                    <option value="LEAD">LEAD</option>
                    <option value="QUALIFIED">QUALIFIED</option>
                    <option value="PROPOSAL">PROPOSAL</option>
                    <option value="NEGOTIATION">NEGOTIATION</option>
                    <option value="WON">WON</option>
                    <option value="LOST">LOST</option>
                </select>

                <input
                    type="date"
                    className="rounded-lg border p-2"
                    value={form.expectedCloseDate ?? ''}
                    onChange={e =>
                        update(
                            'expectedCloseDate',
                            e.target.value,
                        )
                    }
                />

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
                    {loading ? 'Saving...' : 'Save Opportunity'}
                </button>

            </div>

        </form>
    );
}