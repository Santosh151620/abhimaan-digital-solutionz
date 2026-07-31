'use client';

import { useState } from 'react';

import type {
    Quotation,
    QuotationStatus,
} from '@/types/crm/Quotations';

interface QuotationsFormProps {

    quotation?: Partial<Quotation>;

    loading?: boolean;

    onSubmit?: (
        values: Partial<Quotation>,
    ) => void | Promise<void>;

    onCancel?: () => void;

}

const statuses: QuotationStatus[] = [

    'Draft',
    'Sent',
    'Accepted',
    'Rejected',

];

export default function QuotationsForm({

    quotation,

    loading = false,

    onSubmit,

    onCancel,

}: QuotationsFormProps) {

    const [form, setForm] =
        useState<Partial<Quotation>>({

            title:
                quotation?.title ?? '',

            customerName:
                quotation?.customerName ?? '',

            companyId:
                quotation?.companyId,

            opportunityId:
                quotation?.opportunityId,

            amount:
                quotation?.amount ?? 0,

            tax:
                quotation?.tax ?? 0,

            discount:
                quotation?.discount ?? 0,

            currency:
                quotation?.currency ?? 'INR',

            validUntil:
                quotation?.validUntil,

            notes:
                quotation?.notes,

            status:
                quotation?.status ?? 'Draft',

        });

    function update<K extends keyof Partial<Quotation>>(

        key: K,

        value: Partial<Quotation>[K],

    ) {

        setForm(previous => ({

            ...previous,

            [key]: value,

        }));

    }

    async function submit(

        event: React.FormEvent<HTMLFormElement>,

    ) {

        event.preventDefault();

        if (!form.title?.trim()) {

            alert('Quotation Title is required.');

            return;

        }

        if (!form.customerName?.trim()) {

            alert('Customer Name is required.');

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
                    Quotation Details
                </h2>

                <p className="text-sm text-muted-foreground">
                    Create or update quotation.
                </p>

            </div>

            <div className="grid gap-4 md:grid-cols-2">

                <input
                    className="rounded-lg border p-2"
                    placeholder="Quotation Title"
                    value={form.title ?? ''}
                    onChange={event =>
                        update(
                            'title',
                            event.target.value,
                        )
                    }
                />

                <input
                    className="rounded-lg border p-2"
                    placeholder="Customer Name"
                    value={form.customerName ?? ''}
                    onChange={event =>
                        update(
                            'customerName',
                            event.target.value,
                        )
                    }
                />

                <input
                    className="rounded-lg border p-2"
                    placeholder="Company ID"
                    value={form.companyId ?? ''}
                    onChange={event =>
                        update(
                            'companyId',
                            event.target.value,
                        )
                    }
                />

                <input
                    className="rounded-lg border p-2"
                    placeholder="Opportunity ID"
                    value={form.opportunityId ?? ''}
                    onChange={event =>
                        update(
                            'opportunityId',
                            event.target.value,
                        )
                    }
                />

                <input
                    type="number"
                    className="rounded-lg border p-2"
                    placeholder="Amount"
                    value={form.amount ?? 0}
                    onChange={event =>
                        update(
                            'amount',
                            Number(event.target.value),
                        )
                    }
                />

                <input
                    type="number"
                    className="rounded-lg border p-2"
                    placeholder="Tax"
                    value={form.tax ?? 0}
                    onChange={event =>
                        update(
                            'tax',
                            Number(event.target.value),
                        )
                    }
                />

                <input
                    type="number"
                    className="rounded-lg border p-2"
                    placeholder="Discount"
                    value={form.discount ?? 0}
                    onChange={event =>
                        update(
                            'discount',
                            Number(event.target.value),
                        )
                    }
                />

                <input
                    className="rounded-lg border p-2"
                    placeholder="Currency"
                    value={form.currency ?? 'INR'}
                    onChange={event =>
                        update(
                            'currency',
                            event.target.value,
                        )
                    }
                />

                <input
                    type="date"
                    className="rounded-lg border p-2"
                    value={form.validUntil ?? ''}
                    onChange={event =>
                        update(
                            'validUntil',
                            event.target.value,
                        )
                    }
                />

                <select
                    className="rounded-lg border p-2"
                    value={form.status}
                    onChange={event =>
                        update(
                            'status',
                            event.target.value as QuotationStatus,
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

            <textarea
                rows={4}
                className="w-full rounded-lg border p-2"
                placeholder="Notes"
                value={form.notes ?? ''}
                onChange={event =>
                    update(
                        'notes',
                        event.target.value,
                    )
                }
            />

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
                    {loading
                        ? 'Saving...'
                        : 'Save Quotation'}
                </button>

            </div>

        </form>

    );

}