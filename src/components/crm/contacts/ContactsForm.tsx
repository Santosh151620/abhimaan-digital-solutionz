'use client';

import { useState } from 'react';

import type {
    Contact,
    ContactStatus,
    CreateContactInput,
} from '@/types/crm/Contacts';


interface ContactsFormProps {

    initialValues?: Partial<Contact>;

    loading?: boolean;

    onSubmit?: (
        values: CreateContactInput,
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
        useState<CreateContactInput>({

            firstName:
                initialValues?.firstName
                ?? '',

            lastName:
                initialValues?.lastName
                ?? '',

            email:
                initialValues?.email,

            phone:
                initialValues?.phone,

            mobile:
                initialValues?.mobile,

            companyId:
                initialValues?.companyId,

            designation:
                initialValues?.designation,

            department:
                initialValues?.department,

            city:
                initialValues?.city,

            state:
                initialValues?.state,

            country:
                initialValues?.country,

            notes:
                initialValues?.notes,

            status:
                initialValues?.status
                ?? 'ACTIVE',

        });



    function update<K extends keyof CreateContactInput>(

        key: K,

        value: CreateContactInput[K],

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


        if (!form.firstName.trim()) {

            alert('First Name is required.');

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

            <div>

                <h2 className="text-xl font-semibold">
                    Contact Details
                </h2>

                <p className="text-sm text-muted-foreground">
                    Create or update contact.
                </p>

            </div>


            <div className="grid gap-4 md:grid-cols-2">


                {[
                    ['firstName','First Name'],
                    ['lastName','Last Name'],
                    ['email','Email'],
                    ['phone','Phone'],
                    ['mobile','Mobile'],
                    ['companyId','Company Id'],
                    ['designation','Designation'],
                    ['department','Department'],
                    ['city','City'],
                    ['state','State'],
                    ['country','Country'],
                ].map(([key,placeholder]) => (

                    <input
                        key={key}
                        className="rounded-lg border p-2"
                        placeholder={placeholder}
                        value={
                            String(
                                form[key as keyof CreateContactInput]
                                ?? '',
                            )
                        }
                        onChange={
                            event =>
                                update(
                                    key as keyof CreateContactInput,
                                    event.target.value,
                                )
                        }
                    />

                ))}


                <select
                    className="rounded-lg border p-2"
                    value={form.status}
                    onChange={
                        event =>
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



            <textarea

                rows={4}

                className="w-full rounded-lg border p-2"

                placeholder="Notes"

                value={form.notes ?? ''}

                onChange={
                    event =>
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
                        : 'Save Contact'}

                </button>


            </div>


        </form>

    );

}


export default ContactsForm;