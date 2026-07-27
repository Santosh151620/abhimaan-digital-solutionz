'use client';

import { useState } from 'react';

import type {
    Contact,
    ContactStatus,
} from '@/types/crm/Contacts';

interface ContactsFormProps {

    initialValues?: Partial<Contact>;

    loading?: boolean;

    onSubmit?: (
        values: Partial<Contact>,
    ) => void | Promise<void>;

    onCancel?: () => void;

}

const statuses: ContactStatus[] = [

    'ACTIVE',
    'LEAD',
    'CUSTOMER',
    'INACTIVE',

];

export function ContactsForm({

    initialValues,

    loading = false,

    onSubmit,

    onCancel,

}: ContactsFormProps) {

    const [form, setForm] =
        useState<Partial<Contact>>({

            status: 'ACTIVE',

            ...initialValues,

        });

    function update<K extends keyof Contact>(

        key: K,

        value: Contact[K],

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

        if (!form.firstName?.trim()) {

            alert('First Name is required.');

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
                    Contact Details
                </h2>

                <p className="text-sm text-muted-foreground">
                    Create or update contact.
                </p>

            </div>

            <div className="grid gap-4 md:grid-cols-2">

                <input
                    className="rounded-lg border p-2"
                    placeholder="First Name"
                    value={form.firstName ?? ''}
                    onChange={event =>
                        update(
                            'firstName',
                            event.target.value,
                        )
                    }
                />

                <input
                    className="rounded-lg border p-2"
                    placeholder="Last Name"
                    value={form.lastName ?? ''}
                    onChange={event =>
                        update(
                            'lastName',
                            event.target.value,
                        )
                    }
                />

                <input
                    className="rounded-lg border p-2"
                    placeholder="Email"
                    value={form.email ?? ''}
                    onChange={event =>
                        update(
                            'email',
                            event.target.value,
                        )
                    }
                />

                <input
                    className="rounded-lg border p-2"
                    placeholder="Phone"
                    value={form.phone ?? ''}
                    onChange={event =>
                        update(
                            'phone',
                            event.target.value,
                        )
                    }
                />

                <input
                    className="rounded-lg border p-2"
                    placeholder="Mobile"
                    value={form.mobile ?? ''}
                    onChange={event =>
                        update(
                            'mobile',
                            event.target.value,
                        )
                    }
                />

                <input
                    className="rounded-lg border p-2"
                    placeholder="Company Id"
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
                    placeholder="Designation"
                    value={form.designation ?? ''}
                    onChange={event =>
                        update(
                            'designation',
                            event.target.value,
                        )
                    }
                />

                <input
                    className="rounded-lg border p-2"
                    placeholder="Department"
                    value={form.department ?? ''}
                    onChange={event =>
                        update(
                            'department',
                            event.target.value,
                        )
                    }
                />

                <input
                    className="rounded-lg border p-2"
                    placeholder="City"
                    value={form.city ?? ''}
                    onChange={event =>
                        update(
                            'city',
                            event.target.value,
                        )
                    }
                />

                <input
                    className="rounded-lg border p-2"
                    placeholder="State"
                    value={form.state ?? ''}
                    onChange={event =>
                        update(
                            'state',
                            event.target.value,
                        )
                    }
                />

                <input
                    className="rounded-lg border p-2"
                    placeholder="Country"
                    value={form.country ?? ''}
                    onChange={event =>
                        update(
                            'country',
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
                            event.target.value as ContactStatus,
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
                    {loading
                        ? 'Saving...'
                        : 'Save Contact'}
                </button>

            </div>

        </form>

    );

}

export default ContactsForm;
