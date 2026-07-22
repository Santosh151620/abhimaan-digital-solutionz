'use client';

import { useState } from 'react';

import type {
    CalendarEvent,
    CalendarStatus,
} from '@/types/crm/Calendar';


interface Props {

    initialValues?: Partial<CalendarEvent>;

    loading?: boolean;

    onSubmit?: (
        values: Partial<CalendarEvent>
    ) => void | Promise<void>;

    onCancel?: () => void;

}


const statuses: CalendarStatus[] = [
    'Scheduled',
    'Completed',
    'Cancelled',
];


export default function CalendarForm({
    initialValues,
    loading = false,
    onSubmit,
    onCancel,
}: Props) {


    const [form, setForm] =
        useState<Partial<CalendarEvent>>({

            status: 'Scheduled',

            ...initialValues,

        });


    function update<K extends keyof CalendarEvent>(
        key: K,
        value: CalendarEvent[K],
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
                'Event title is required.'
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
                        Status
                    </label>

                    <select
                        className="w-full rounded-lg border p-2"
                        value={form.status}
                        onChange={e =>
                            update(
                                'status',
                                e.target.value as CalendarStatus,
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



                <div>

                    <label className="mb-1 block text-sm font-medium">
                        Start Date
                    </label>

                    <input
                        type="datetime-local"
                        className="w-full rounded-lg border p-2"
                        value={form.startDate ?? ''}
                        onChange={e =>
                            update(
                                'startDate',
                                e.target.value,
                            )
                        }
                    />

                </div>



                <div>

                    <label className="mb-1 block text-sm font-medium">
                        End Date
                    </label>

                    <input
                        type="datetime-local"
                        className="w-full rounded-lg border p-2"
                        value={form.endDate ?? ''}
                        onChange={e =>
                            update(
                                'endDate',
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
                            : 'Save Event'
                    }
                </button>


            </div>


        </form>

    );

}