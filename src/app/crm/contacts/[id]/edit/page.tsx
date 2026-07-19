import {
    notFound,
    redirect,
} from 'next/navigation';

import CRMPageLayout from '@/components/crm/shared/layout/CRMPageLayout';
import PageHeader from '@/components/crm/ui/PageHeader';

import {
    ContactsForm,
} from '@/components/crm/contacts';

import {
    ContactsServiceInstance,
} from '@/services/crm/ContactsService';

import {
    updateContact,
} from '../../actions';

import type {
    ContactDetails,
} from '@/types/crm/Contacts';


interface Props {
    params: Promise<{
        id: string;
    }>;
}


export default async function EditContactPage({
    params,
}: Props) {

    const {
        id,
    } = await params;


    const contact =
        await ContactsServiceInstance.details(id);


    if (!contact) {
        notFound();
    }


    async function submit(
        values: Partial<ContactDetails>
    ) {
        'use server';


        await updateContact(
            id,
            values,
        );


        redirect(
            `/crm/contacts/${id}`
        );
    }


    return (
        <CRMPageLayout>

            <PageHeader
                title="Edit Contact"
                description="Update CRM contact details."
            />


            <ContactsForm
                initialValues={contact}
                onSubmit={submit}
            />

        </CRMPageLayout>
    );
}