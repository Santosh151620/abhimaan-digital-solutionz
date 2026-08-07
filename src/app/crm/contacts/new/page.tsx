import {
    redirect,
} from 'next/navigation';

import CRMPageLayout from '@/components/crm/shared/layout/CRMPageLayout';
import CRMHeader from '@/components/crm/shared/layout/CRMHeader';

import {
    ContactsForm,
} from '@/components/crm/contacts';

import {
    createContact,
} from '../actions';

import type {
    CreateContactInput,
} from '@/types/crm/Contacts';



export default function NewContactPage() {


    async function handleSubmit(
        values: CreateContactInput,
    ): Promise<void> {

        'use server';


        await createContact(
            values,
        );


        redirect(
            '/crm/contacts',
        );

    }



    return (

        <CRMPageLayout>


            <CRMHeader

                title="New Contact"

                description="Create a new contact for your CRM."

                actions={[
                    {
                        label: 'Back',
                        href: '/crm/contacts',
                    },
                ]}

            />


            <ContactsForm

                onSubmit={
                    handleSubmit
                }

            />


        </CRMPageLayout>

    );

}