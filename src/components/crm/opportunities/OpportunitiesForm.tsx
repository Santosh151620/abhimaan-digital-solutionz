'use client';

import { useState } from 'react';

import type {
    Opportunity,
    CreateOpportunityInput,
} from '@/types/crm/Opportunities';

interface OpportunitiesFormProps {

    initialValues?: Partial<Opportunity>;

    loading?: boolean;

    onSubmit: (
        values: CreateOpportunityInput,
    ) => void | Promise<void>;

    onCancel?: () => void;

}

export default function OpportunitiesForm({

    initialValues,

    loading = false,

    onSubmit,

    onCancel,

}: OpportunitiesFormProps) {

    const [form, setForm] =
        useState<Partial<Opportunity>>({

            stage: 'New',

            status: 'Open',

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
        event: React.FormEvent<HTMLFormElement>,
    ) {

        event.preventDefault();

        if (!form.name?.trim()) {

            alert('Opportunity Name is required.');

            return;

        }

        await onSubmit({

            name: form.name,

            title: form.title,

            description: form.description,

            companyId: form.companyId,

            contactId: form.contactId,

            leadId: form.leadId,

            ownerId: form.ownerId,

            assignedTo: form.assignedTo,

            stage: form.stage,

            status: form.status,

            value: form.value,

            probability: form.probability,

            expectedCloseDate: form.expectedCloseDate,

            forecastRevenue: form.forecastRevenue,

            recurringRevenue: form.recurringRevenue,

            currency: form.currency,

            source: form.source,

            competitor: form.competitor,

            notes: form.notes,

            metadata: form.metadata,

        });

    }

    return (

        <form
            onSubmit={submit}
            className="space-y-6 rounded-xl border bg-background p-6"
        >

            <div>

                <h2 className="text-xl font-semibold">
                    Opportunity Details
                </h2>

                <p className="text-sm text-muted-foreground">
                    Create or update an opportunity.
                </p>

            </div>

            <input
                className="w-full rounded-lg border p-2"
                placeholder="Opportunity Name"
                value={form.name ?? ''}
                onChange={(e) => update('name', e.target.value)}
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
                    {loading ? 'Saving...' : 'Save Opportunity'}
                </button>

            </div>

        </form>

    );

}