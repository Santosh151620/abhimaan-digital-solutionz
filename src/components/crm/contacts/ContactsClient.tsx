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
    updateContact,
} from '@/app/crm/contacts/actions';

import type {
    Contact,

    ContactsSummary as ContactsSummaryModel,
    CreateContactInput,
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
        values: CreateContactInput,
    ) {

        const firstName =
            values.firstName.trim();


        const lastName =
            values.lastName.trim();


        if (!firstName) {
            return;
        }


        if (!lastName) {
            return;
        }


        try {

            setIsSaving(true);


            const created =
                await createContact({

                    ...values,

                    firstName,

                    lastName,

                    status:
                        values.status
                        ?? 'ACTIVE',

                });


            setContacts(
                previous => [
                    created,
                    ...previous,
                ],
            );


            setShowForm(
                false,
            );


        }
        finally {

            setIsSaving(
                false,
            );

        }

    }


    async function handleUpdate(
        values: CreateContactInput,
    ) {

        if (!selectedContact) {
            return;
        }


        try {

            setIsSaving(true);


            const updated =
                await updateContact(

                    selectedContact.id,

                    values,

                );


            setContacts(

                previous =>
                    previous.map(

                        item =>
                            item.id === updated.id
                                ? updated
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
        finally {

            setIsSaving(
                false,
            );

        }

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

                        loading={
                            isSaving
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
                contacts={contacts}
            />

        </div>

    );

}


