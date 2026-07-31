'use client';

import {
    useMemo,
    useState,
} from 'react';

import {
    createContact,
    updateContact,
} from '@/app/crm/contacts/actions';

import {
    ContactsForm,
    ContactsSummary,
    ContactsTable,
} from './index';

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
                contact =>
                    contact.status === 'ACTIVE',
            ).length,

        inactive:
            contacts.filter(
                contact =>
                    contact.status === 'INACTIVE',
            ).length,

        leads:
            contacts.filter(
                contact =>
                    contact.status === 'LEAD',
            ).length,

        customers:
            contacts.filter(
                contact =>
                    contact.status === 'CUSTOMER',
            ).length,

        archived:
            contacts.filter(
                contact =>
                    contact.status === 'ARCHIVED',
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
        useState<Contact>();


    const [loading, setLoading] =
        useState(false);



    const summary =
        useMemo(
            () =>
                buildSummary(
                    contacts,
                ),
            [
                contacts,
            ],
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

            setLoading(true);


            const created =
                await createContact(
                    values as never,
                );


            setContacts(
                previous => [
                    created,
                    ...previous,
                ],
            );


            setShowForm(false);


        } finally {

            setLoading(false);

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



        try {

            setLoading(true);



            const updated =
                await updateContact(

                    selectedContact.id,

                    values as never,

                );



            setContacts(
                previous =>
                    previous.map(
                        contact =>
                            contact.id === updated.id

                                ? updated

                                : contact,
                    ),
            );



            setSelectedContact(
                undefined,
            );


            setShowForm(false);



        } finally {

            setLoading(false);

        }

    }
    function beginCreate() {


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
                summary={
                    summary
                }
            />



            <div className="flex items-center justify-between">


                <h2 className="text-xl font-semibold">
                    Contacts
                </h2>



                <button

                    disabled={
                        loading
                    }

                    onClick={
                        beginCreate
                    }

                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"

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