import CRMPageLayout from '@/components/crm/shared/layout/CRMPageLayout';
import CRMHeader from '@/components/crm/shared/layout/CRMHeader';
import CRMToolbar from '@/components/crm/shared/toolbar/CRMToolbar';
import CRMTableContainer from '@/components/crm/shared/table/CRMTableContainer';
import CRMEmptyState from '@/components/crm/shared/table/CRMEmptyState';

import ContactsTable from '@/components/crm/contacts/ContactsTable';

import {
    listContacts,
} from './actions';


export default async function ContactsPage() {

    const contacts =
        await listContacts();


    return (

        <CRMPageLayout>

            <CRMHeader
                title="Contacts"
                description="Manage customer and business contacts."
                actions={[
                    {
                        label: 'New Contact',
                        href: '/crm/contacts/new',
                    },
                ]}
            />


            <CRMToolbar
                title="Contacts"
                createHref="/crm/contacts/new"
                createLabel="New Contact"
            />


            <CRMTableContainer
                title="Contacts"
                description="All CRM contacts."
            >

                {contacts.length === 0 ? (

                    <CRMEmptyState
                        title="No contacts found"
                        description="Create your first CRM contact to get started."
                        actionHref="/crm/contacts/new"
                        actionLabel="Create Contact"
                    />

                ) : (

                    <ContactsTable
                        contacts={contacts}
                    />

                )}

            </CRMTableContainer>


        </CRMPageLayout>

    );

}