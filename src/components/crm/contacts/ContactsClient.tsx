'use client';

import {
    useState,
} from 'react';

import {
    ContactsForm,
    ContactsSummary,
    ContactsTable,
} from './index';

import {
    createContact,
} from '@/app/crm/contacts/actions';

import type {
    Contact,
    ContactsSummary as ContactsSummaryModel,
} from '@/types/crm/Contacts';


interface Props {

    initialContacts: Contact[];

}



function buildSummary(
    contacts: Contact[],
): ContactsSummaryModel {

    return {

        total:
            contacts.length,

        active:
            contacts.filter(
                item =>
                    item.status === 'ACTIVE',
            ).length,

        inactive:
            contacts.filter(
                item =>
                    item.status === 'INACTIVE',
            ).length,

        leads:
            contacts.filter(
                item =>
                    item.status === 'LEAD',
            ).length,

        customers:
            contacts.filter(
                item =>
                    item.status === 'CUSTOMER',
            ).length,

        archived:
            contacts.filter(
                item =>
                    item.status === 'ARCHIVED',
            ).length,

    };

}



export default function ContactsClient({

    initialContacts,

}: Props) {


    const [contacts, setContacts] =
        useState<Contact[]>(
            initialContacts,
        );


    const [showForm, setShowForm] =
        useState(false);


    const [selectedContact, setSelectedContact] =
        useState<Contact | undefined>();


    const [isSaving, setIsSaving] =
        useState(false);



    const summary =
        buildSummary(
            contacts,
        );



    async function handleCreate(
        values: Partial<Contact>,
    ) {


        if (
            !values.firstName?.trim()
        ) {

            return;

        }


        try {

            setIsSaving(true);


            const created =
                await createContact({

                    firstName:
                        values.firstName,

                    lastName:
                        values.lastName ?? '',

                    companyId:
                        values.companyId,

                    email:
                        values.email,

                    phone:
                        values.phone,

                    mobile:
                        values.mobile,

                    designation:
                        values.designation,

                    department:
                        values.department,

                    status:
                        values.status ?? 'ACTIVE',

                    ownerId:
                        values.ownerId,

                    assignedTo:
                        values.assignedTo,

                    city:
                        values.city,

                    state:
                        values.state,

                    country:
                        values.country,

                    notes:
                        values.notes,

                    metadata:
                        values.metadata,

                });


            setContacts(
                previous => [
                    created,
                    ...previous,
                ],
            );


            setShowForm(false);


        }
        finally {

            setIsSaving(false);

        }

    }



    async function handleUpdate(
        values: Partial<Contact>,
    ) {

        if (
            !selectedContact
        ) {

            return;

        }


        setContacts(
            previous =>
                previous.map(
                    item =>
                        item.id === selectedContact.id
                            ? {
                                ...item,
                                ...values,
                                updatedAt:
                                    new Date()
                                        .toISOString(),
                            }
                            : item,
                ),
        );


        setSelectedContact(
            undefined,
        );


        setShowForm(
            false,
        );

    }



    function startCreate() {

        setSelectedContact(
            undefined,
        );

        setShowForm(
            true,
        );

    }



    return (

        <div className="space-y-6">

            <ContactsSummary
                summary={summary}
            />


            <div className="flex items-center justify-between">

                <h2 className="text-xl font-semibold">
                    Contacts
                </h2>


                <button

                    type="button"

                    onClick={startCreate}

                    disabled={isSaving}

                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"

                >

                    New Contact

                </button>


            </div>



            {
                showForm && (

                    <ContactsForm

                        initialValues={
                            selectedContact
                        }


                        onSubmit={
                            selectedContact
                                ? handleUpdate
                                : handleCreate
                        }


                        onCancel={() => {

                            setSelectedContact(
                                undefined,
                            );

                            setShowForm(
                                false,
                            );

                        }}

                    />

                )
            }



            <ContactsTable

                contacts={
                    contacts
                }

            />

        </div>

    );

}