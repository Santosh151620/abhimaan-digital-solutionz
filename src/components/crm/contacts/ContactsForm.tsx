'use client';

import {
    useState,
} from 'react';

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


function ContactsForm({

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

            middleName:
                initialValues?.middleName,

            lastName:
                initialValues?.lastName
                ?? '',

            companyId:
                initialValues?.companyId,

            contactCode:
                initialValues?.contactCode,

            email:
                initialValues?.email,

            phone:
                initialValues?.phone,

            mobile:
                initialValues?.mobile,

            whatsapp:
                initialValues?.whatsapp,

            linkedinUrl:
                initialValues?.linkedinUrl,

            jobTitle:
                initialValues?.jobTitle,

            designation:
                initialValues?.designation,

            department:
                initialValues?.department,

            dateOfBirth:
                initialValues?.dateOfBirth,

            anniversary:
                initialValues?.anniversary,

            status:
                initialValues?.status
                ?? 'ACTIVE',

            ownerId:
                initialValues?.ownerId,

            assignedTo:
                initialValues?.assignedTo,

            address:
                initialValues?.address,

            city:
                initialValues?.city,

            state:
                initialValues?.state,

            country:
                initialValues?.country,

            postalCode:
                initialValues?.postalCode,

            notes:
                initialValues?.notes,

            metadata:
                initialValues?.metadata,

            entityType:
                'Contact',

            entityId:
                initialValues?.entityId,

            isActive:
                initialValues?.isActive
                ?? true,

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


        const firstName =
            form.firstName.trim();


        const lastName =
            form.lastName.trim();


        if (!firstName) {

            alert(
                'First Name is required.',
            );

            return;

        }


        if (!lastName) {

            alert(
                'Last Name is required.',
            );

            return;

        }


        await onSubmit?.({

            ...form,

            firstName,

            lastName,

        });

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


            <section className="space-y-4">

                <h3 className="text-sm font-semibold">
                    Identity
                </h3>

                <div className="grid gap-4 md:grid-cols-2">

                    <input
                        className="rounded-lg border p-2"
                        placeholder="First Name"
                        value={
                            form.firstName
                        }
                        onChange={
                            event =>
                                update(
                                    'firstName',
                                    event.target.value,
                                )
                        }
                        required
                    />


                    <input
                        className="rounded-lg border p-2"
                        placeholder="Middle Name"
                        value={
                            form.middleName
                            ?? ''
                        }
                        onChange={
                            event =>
                                update(
                                    'middleName',
                                    event.target.value,
                                )
                        }
                    />


                    <input
                        className="rounded-lg border p-2"
                        placeholder="Last Name"
                        value={
                            form.lastName
                        }
                        onChange={
                            event =>
                                update(
                                    'lastName',
                                    event.target.value,
                                )
                        }
                        required
                    />


                    <input
                        className="rounded-lg border p-2"
                        placeholder="Contact Code"
                        value={
                            form.contactCode
                            ?? ''
                        }
                        onChange={
                            event =>
                                update(
                                    'contactCode',
                                    event.target.value,
                                )
                        }
                    />


                    <input
                        className="rounded-lg border p-2 md:col-span-2"
                        placeholder="Company Id"
                        value={
                            form.companyId
                            ?? ''
                        }
                        onChange={
                            event =>
                                update(
                                    'companyId',
                                    event.target.value,
                                )
                        }
                    />

                </div>

            </section>


            <section className="space-y-4">

                <h3 className="text-sm font-semibold">
                    Professional Information
                </h3>

                <div className="grid gap-4 md:grid-cols-2">

                    <input
                        className="rounded-lg border p-2"
                        placeholder="Job Title"
                        value={
                            form.jobTitle
                            ?? ''
                        }
                        onChange={
                            event =>
                                update(
                                    'jobTitle',
                                    event.target.value,
                                )
                        }
                    />


                    <input
                        className="rounded-lg border p-2"
                        placeholder="Designation"
                        value={
                            form.designation
                            ?? ''
                        }
                        onChange={
                            event =>
                                update(
                                    'designation',
                                    event.target.value,
                                )
                        }
                    />


                    <input
                        className="rounded-lg border p-2"
                        placeholder="Department"
                        value={
                            form.department
                            ?? ''
                        }
                        onChange={
                            event =>
                                update(
                                    'department',
                                    event.target.value,
                                )
                        }
                    />

                </div>

            </section>


            <section className="space-y-4">

                <h3 className="text-sm font-semibold">
                    Communication
                </h3>

                <div className="grid gap-4 md:grid-cols-2">

                    <input
                        type="email"
                        className="rounded-lg border p-2"
                        placeholder="Email"
                        value={
                            form.email
                            ?? ''
                        }
                        onChange={
                            event =>
                                update(
                                    'email',
                                    event.target.value,
                                )
                        }
                    />


                    <input
                        className="rounded-lg border p-2"
                        placeholder="Phone"
                        value={
                            form.phone
                            ?? ''
                        }
                        onChange={
                            event =>
                                update(
                                    'phone',
                                    event.target.value,
                                )
                        }
                    />


                    <input
                        className="rounded-lg border p-2"
                        placeholder="Mobile"
                        value={
                            form.mobile
                            ?? ''
                        }
                        onChange={
                            event =>
                                update(
                                    'mobile',
                                    event.target.value,
                                )
                        }
                    />


                    <input
                        className="rounded-lg border p-2"
                        placeholder="WhatsApp"
                        value={
                            form.whatsapp
                            ?? ''
                        }
                        onChange={
                            event =>
                                update(
                                    'whatsapp',
                                    event.target.value,
                                )
                        }
                    />


                    <input
                        type="url"
                        className="rounded-lg border p-2 md:col-span-2"
                        placeholder="LinkedIn URL"
                        value={
                            form.linkedinUrl
                            ?? ''
                        }
                        onChange={
                            event =>
                                update(
                                    'linkedinUrl',
                                    event.target.value,
                                )
                        }
                    />

                </div>

            </section>


            <section className="space-y-4">

                <h3 className="text-sm font-semibold">
                    Personal Information
                </h3>

                <div className="grid gap-4 md:grid-cols-2">

                    <label className="space-y-1">

                        <span className="text-sm">
                            Date of Birth
                        </span>

                        <input
                            type="date"
                            className="w-full rounded-lg border p-2"
                            value={
                                form.dateOfBirth
                                ?? ''
                            }
                            onChange={
                                event =>
                                    update(
                                        'dateOfBirth',
                                        event.target.value
                                        || null,
                                    )
                            }
                        />

                    </label>


                    <label className="space-y-1">

                        <span className="text-sm">
                            Anniversary
                        </span>

                        <input
                            type="date"
                            className="w-full rounded-lg border p-2"
                            value={
                                form.anniversary
                                ?? ''
                            }
                            onChange={
                                event =>
                                    update(
                                        'anniversary',
                                        event.target.value
                                        || null,
                                    )
                            }
                        />

                    </label>

                </div>

            </section>


            <section className="space-y-4">

                <h3 className="text-sm font-semibold">
                    CRM Assignment
                </h3>

                <div className="grid gap-4 md:grid-cols-2">

                    <select
                        className="rounded-lg border p-2"
                        value={
                            form.status
                            ?? 'ACTIVE'
                        }
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


                    <input
                        className="rounded-lg border p-2"
                        placeholder="Owner Id"
                        value={
                            form.ownerId
                            ?? ''
                        }
                        onChange={
                            event =>
                                update(
                                    'ownerId',
                                    event.target.value,
                                )
                        }
                    />


                    <input
                        className="rounded-lg border p-2"
                        placeholder="Assigned To"
                        value={
                            form.assignedTo
                            ?? ''
                        }
                        onChange={
                            event =>
                                update(
                                    'assignedTo',
                                    event.target.value,
                                )
                        }
                    />

                </div>

            </section>


            <section className="space-y-4">

                <h3 className="text-sm font-semibold">
                    Address
                </h3>

                <div className="grid gap-4 md:grid-cols-2">

                    <input
                        className="rounded-lg border p-2 md:col-span-2"
                        placeholder="Address"
                        value={
                            form.address
                            ?? ''
                        }
                        onChange={
                            event =>
                                update(
                                    'address',
                                    event.target.value,
                                )
                        }
                    />


                    <input
                        className="rounded-lg border p-2"
                        placeholder="City"
                        value={
                            form.city
                            ?? ''
                        }
                        onChange={
                            event =>
                                update(
                                    'city',
                                    event.target.value,
                                )
                        }
                    />


                    <input
                        className="rounded-lg border p-2"
                        placeholder="State"
                        value={
                            form.state
                            ?? ''
                        }
                        onChange={
                            event =>
                                update(
                                    'state',
                                    event.target.value,
                                )
                        }
                    />


                    <input
                        className="rounded-lg border p-2"
                        placeholder="Country"
                        value={
                            form.country
                            ?? ''
                        }
                        onChange={
                            event =>
                                update(
                                    'country',
                                    event.target.value,
                                )
                        }
                    />


                    <input
                        className="rounded-lg border p-2"
                        placeholder="Postal Code"
                        value={
                            form.postalCode
                            ?? ''
                        }
                        onChange={
                            event =>
                                update(
                                    'postalCode',
                                    event.target.value,
                                )
                        }
                    />

                </div>

            </section>


            <section className="space-y-4">

                <h3 className="text-sm font-semibold">
                    Notes
                </h3>

                <textarea
                    rows={4}
                    className="w-full rounded-lg border p-2"
                    placeholder="Notes"
                    value={
                        form.notes
                        ?? ''
                    }
                    onChange={
                        event =>
                            update(
                                'notes',
                                event.target.value,
                            )
                    }
                />

            </section>


            <div className="flex justify-end gap-3">

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
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