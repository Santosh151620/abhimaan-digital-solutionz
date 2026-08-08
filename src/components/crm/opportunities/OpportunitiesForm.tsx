'use client';

import {
    useState,
} from 'react';

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


const stages = [
    'New',
    'Qualified',
    'Proposal',
    'Negotiation',
    'Closed Won',
    'Closed Lost',
] as const;


const statuses = [
    'Open',
    'Won',
    'Lost',
    'Cancelled',
] as const;


export default function OpportunitiesForm({

    initialValues,

    loading = false,

    onSubmit,

    onCancel,

}: OpportunitiesFormProps) {


    const [
        form,
        setForm,
    ] =
        useState<Partial<Opportunity>>({

            stage:
                initialValues?.stage
                ??
                'New',

            status:
                initialValues?.status
                ??
                'Open',

            probability:
                initialValues?.probability
                ??
                10,

            value:
                initialValues?.value
                ??
                0,

            currency:
                initialValues?.currency
                ??
                'INR',

            ...initialValues,

        });


    const [
        error,
        setError,
    ] =
        useState<string | null>(
            null,
        );


    function update<K extends keyof Opportunity>(
        key: K,
        value: Opportunity[K],
    ) {

        setForm(
            current => ({
                ...current,
                [key]: value,
            }),
        );

    }


    async function submit(
        event: React.FormEvent<HTMLFormElement>,
    ) {

        event.preventDefault();

        setError(null);


        const name =
            form.name
                ?.trim();


        if (!name) {

            setError(
                'Opportunity name is required.',
            );

            return;

        }


        const value =
            Number(
                form.value
                ??
                0,
            );


        if (
            !Number.isFinite(value)
            ||
            value < 0
        ) {

            setError(
                'Opportunity value must be zero or greater.',
            );

            return;

        }


        const probability =
            Number(
                form.probability
                ??
                0,
            );


        if (
            !Number.isFinite(probability)
            ||
            probability < 0
            ||
            probability > 100
        ) {

            setError(
                'Probability must be between 0 and 100.',
            );

            return;

        }


        await onSubmit({

            name,

            title:
                form.title?.trim()
                ||
                name,

            description:
                form.description
                ??
                undefined,

            companyId:
                form.companyId
                ??
                undefined,

            contactId:
                form.contactId
                ??
                undefined,

            leadId:
                form.leadId
                ??
                undefined,

            ownerId:
                form.ownerId
                ??
                undefined,

            assignedTo:
                form.assignedTo
                ??
                undefined,

            stage:
                form.stage
                ??
                'New',

            status:
                form.status
                ??
                'Open',

            value,

            probability,

            expectedCloseDate:
                form.expectedCloseDate
                ??
                undefined,

            forecastRevenue:
                form.forecastRevenue
                ??
                undefined,

            recurringRevenue:
                form.recurringRevenue
                ??
                undefined,

            currency:
                form.currency
                ??
                'INR',

            source:
                form.source
                ??
                undefined,

            competitor:
                form.competitor
                ??
                undefined,

            notes:
                form.notes
                ??
                undefined,

            metadata:
                form.metadata
                ??
                undefined,

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
                    Create or update a CRM sales opportunity.
                </p>

            </div>


            {error && (

                <div
                    role="alert"
                    className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                    {error}
                </div>

            )}


            <div className="grid gap-4 md:grid-cols-2">


                <div className="space-y-2 md:col-span-2">

                    <label
                        htmlFor="opportunity-name"
                        className="text-sm font-medium"
                    >
                        Opportunity Name *
                    </label>

                    <input
                        id="opportunity-name"
                        value={form.name ?? ''}
                        onChange={event =>
                            update(
                                'name',
                                event.target.value,
                            )
                        }
                        placeholder="Enter opportunity name"
                        disabled={loading}
                        required
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    />

                </div>


                <div className="space-y-2">

                    <label
                        htmlFor="opportunity-stage"
                        className="text-sm font-medium"
                    >
                        Stage
                    </label>

                    <select
                        id="opportunity-stage"
                        value={form.stage ?? 'New'}
                        onChange={event =>
                            update(
                                'stage',
                                event.target.value as Opportunity['stage'],
                            )
                        }
                        disabled={loading}
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    >

                        {stages.map(stage => (

                            <option
                                key={stage}
                                value={stage}
                            >
                                {stage}
                            </option>

                        ))}

                    </select>

                </div>


                <div className="space-y-2">

                    <label
                        htmlFor="opportunity-status"
                        className="text-sm font-medium"
                    >
                        Status
                    </label>

                    <select
                        id="opportunity-status"
                        value={form.status ?? 'Open'}
                        onChange={event =>
                            update(
                                'status',
                                event.target.value as Opportunity['status'],
                            )
                        }
                        disabled={loading}
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
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


                <div className="space-y-2">

                    <label
                        htmlFor="opportunity-value"
                        className="text-sm font-medium"
                    >
                        Deal Value
                    </label>

                    <input
                        id="opportunity-value"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.value ?? 0}
                        onChange={event =>
                            update(
                                'value',
                                Number(event.target.value),
                            )
                        }
                        disabled={loading}
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    />

                </div>


                <div className="space-y-2">

                    <label
                        htmlFor="opportunity-probability"
                        className="text-sm font-medium"
                    >
                        Probability %
                    </label>

                    <input
                        id="opportunity-probability"
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={form.probability ?? 0}
                        onChange={event =>
                            update(
                                'probability',
                                Number(event.target.value),
                            )
                        }
                        disabled={loading}
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    />

                </div>


                <div className="space-y-2">

                    <label
                        htmlFor="opportunity-currency"
                        className="text-sm font-medium"
                    >
                        Currency
                    </label>

                    <input
                        id="opportunity-currency"
                        value={form.currency ?? 'INR'}
                        onChange={event =>
                            update(
                                'currency',
                                event.target.value,
                            )
                        }
                        disabled={loading}
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    />

                </div>


                <div className="space-y-2">

                    <label
                        htmlFor="opportunity-close-date"
                        className="text-sm font-medium"
                    >
                        Expected Close Date
                    </label>

                    <input
                        id="opportunity-close-date"
                        type="date"
                        value={
                            form.expectedCloseDate
                            ??
                            ''
                        }
                        onChange={event =>
                            update(
                                'expectedCloseDate',
                                event.target.value,
                            )
                        }
                        disabled={loading}
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    />

                </div>


                <div className="space-y-2">

                    <label
                        htmlFor="opportunity-company"
                        className="text-sm font-medium"
                    >
                        Company ID
                    </label>

                    <input
                        id="opportunity-company"
                        value={form.companyId ?? ''}
                        onChange={event =>
                            update(
                                'companyId',
                                event.target.value || undefined,
                            )
                        }
                        disabled={loading}
                        placeholder="Company ID"
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    />

                </div>


                <div className="space-y-2">

                    <label
                        htmlFor="opportunity-contact"
                        className="text-sm font-medium"
                    >
                        Contact ID
                    </label>

                    <input
                        id="opportunity-contact"
                        value={form.contactId ?? ''}
                        onChange={event =>
                            update(
                                'contactId',
                                event.target.value || undefined,
                            )
                        }
                        disabled={loading}
                        placeholder="Contact ID"
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    />

                </div>


                <div className="space-y-2">

                    <label
                        htmlFor="opportunity-owner"
                        className="text-sm font-medium"
                    >
                        Owner ID
                    </label>

                    <input
                        id="opportunity-owner"
                        value={form.ownerId ?? ''}
                        onChange={event =>
                            update(
                                'ownerId',
                                event.target.value || undefined,
                            )
                        }
                        disabled={loading}
                        placeholder="Owner ID"
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    />

                </div>


                <div className="space-y-2 md:col-span-2">

                    <label
                        htmlFor="opportunity-description"
                        className="text-sm font-medium"
                    >
                        Description
                    </label>

                    <textarea
                        id="opportunity-description"
                        value={form.description ?? ''}
                        onChange={event =>
                            update(
                                'description',
                                event.target.value,
                            )
                        }
                        disabled={loading}
                        rows={4}
                        placeholder="Describe the opportunity..."
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    />

                </div>


                <div className="space-y-2 md:col-span-2">

                    <label
                        htmlFor="opportunity-notes"
                        className="text-sm font-medium"
                    >
                        Notes
                    </label>

                    <textarea
                        id="opportunity-notes"
                        value={form.notes ?? ''}
                        onChange={event =>
                            update(
                                'notes',
                                event.target.value,
                            )
                        }
                        disabled={loading}
                        rows={3}
                        placeholder="Additional sales notes..."
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    />

                </div>


            </div>


            <div className="flex justify-end gap-3 border-t pt-4">

                <button
                    type="button"
                    onClick={() => onCancel?.()}
                    disabled={loading}
                    className="rounded-md border px-4 py-2 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Cancel
                </button>


                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading
                        ? 'Saving...'
                        : 'Save Opportunity'}
                </button>

            </div>

        </form>

    );

}