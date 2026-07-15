'use client';

import { useState } from 'react';
import type { Contact } from '@/types/crm/Contacts';

interface ContactsFormProps {
    initialValues?: Partial<Contact>;
    loading?: boolean;
    onSubmit?: (
        values: Partial<Contact>
    ) => void | Promise<void>;
    onCancel?: () => void;
}

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
                    onChange={e =>
                        update(
                            'firstName',
                            e.target.value,
                        )
                    }
                />

                <input
                    className="rounded-lg border p-2"
                    placeholder="Last Name"
                    value={form.lastName ?? ''}
                    onChange={e =>
                        update(
                            'lastName',
                            e.target.value,
                        )
                    }
                />

                <input
                    className="rounded-lg border p-2"
                    placeholder="Email"
                    value={form.email ?? ''}
                    onChange={e =>
                        update(
                            'email',
                            e.target.value,
                        )
                    }
                />

                <input
                    className="rounded-lg border p-2"
                    placeholder="Phone"
                    value={form.phone ?? ''}
                    onChange={e =>
                        update(
                            'phone',
                            e.target.value,
                        )
                    }
                />

                <input
                    className="rounded-lg border p-2"
                    placeholder="Company Id"
                    value={form.companyId ?? ''}
                    onChange={e =>
                        update(
                            'companyId',
                            e.target.value,
                        )
                    }
                />

                <input
                    className="rounded-lg border p-2"
                    placeholder="Designation"
                    value={form.designation ?? ''}
                    onChange={e =>
                        update(
                            'designation',
                            e.target.value,
                        )
                    }
                />

                <select
                    className="rounded-lg border p-2"
                    value={form.status}
                    onChange={e =>
                        update(
                            'status',
                            e.target.value as Contact['status'],
                        )
                    }
                >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="LEAD">LEAD</option>
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="INACTIVE">INACTIVE</option>
                </select>

            </div>

            <div className="flex justify-end gap-3">

                <button
                    type="button"
                    className="rounded-lg border px-4 py-2"
                    onClick={onCancel}
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