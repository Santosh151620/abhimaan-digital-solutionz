'use client';

import {
    useMemo,
    useState,
} from 'react';

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

    const summary =
        useMemo(
            () => buildSummary(
                contacts,
            ),
            [contacts],
        );

    async function createContact(
        values: Partial<Contact>,
    ) {

        if (
            !values.firstName?.trim()
        ) {

            return;

        }

        const now =
            new Date().toISOString();

        const contact: Contact = {

            id:
                crypto.randomUUID(),

            entityType:
                'Contact',

            entityId:
                crypto.randomUUID(),

            organizationId:
                values.organizationId,

            companyId:
                values.companyId,

            firstName:
                values.firstName,

            lastName:
                values.lastName ?? '',

            fullName:
                `${values.firstName} ${values.lastName ?? ''}`.trim(),

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
                values.status ??
                'ACTIVE',

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

            createdAt:
                now,

            updatedAt:
                now,

        };

        setContacts(previous => [
            contact,
            ...previous,
        ]);

        setShowForm(false);

    }

    async function updateContact(
        values: Partial<Contact>,
    ) {

        if (
            !selectedContact
        ) {

            return;

        }

        setContacts(previous =>
            previous.map(contact =>

                contact.id === selectedContact.id

                    ? {

                        ...contact,

                        ...values,

                        fullName:
                            `${values.firstName ?? contact.firstName} ${values.lastName ?? contact.lastName}`.trim(),

                        updatedAt:
                            new Date().toISOString(),

                    }

                    : contact,

            ),
        );

        setSelectedContact(undefined);

        setShowForm(false);

    }

    function beginCreate() {

        setSelectedContact(
            undefined,
        );

        setShowForm(true);

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
                    onClick={beginCreate}
                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                >
                    New Contact
                </button>

            </div>

            {showForm && (

                <ContactsForm
                    initialValues={
                        selectedContact
                    }
                    onSubmit={
                        selectedContact
                            ? updateContact
                            : createContact
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

            )}

            <ContactsTable
                contacts={contacts}
            />

        </div>

    );

}
