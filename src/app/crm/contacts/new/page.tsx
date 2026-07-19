import CRMPageLayout from '@/components/crm/shared/layout/CRMPageLayout';

import PageHeader from '@/components/crm/ui/PageHeader';

import {
    ContactsForm,
} from '@/components/crm/contacts';

import {
    createContact,
} from '../actions';

import {
    redirect,
} from 'next/navigation';


export default function NewContactPage() {


    async function submit(
        values: any
    ) {
        'use server';


        await createContact(
            values
        );


        redirect(
            '/crm/contacts'
        );
    }


    return (

        <CRMPageLayout>

            <PageHeader
                title="New Contact"
                description="Create a new contact for your CRM."
            />


            <ContactsForm
                onSubmit={submit}
            />

        </CRMPageLayout>

    );
}