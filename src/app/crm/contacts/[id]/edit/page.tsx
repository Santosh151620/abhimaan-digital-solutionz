import {
    notFound,
    redirect,
} from 'next/navigation';

import CRMPageLayout from '@/components/crm/shared/layout/CRMPageLayout';
import CRMHeader from '@/components/crm/shared/layout/CRMHeader';

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
    CreateContactInput,
} from '@/types/crm/Contacts';



interface EditContactPageProps {

    params: Promise<{
        id: string;
    }>;

}



/**
 * Edit Contact Page
 *
 * Responsibilities:
 * - Resolve route parameter safely.
 * - Load tenant-scoped contact.
 * - Render shared CRM contact form.
 * - Persist updates through server action.
 * - Redirect after successful update.
 *
 * Tenant isolation:
 * Repository layer enforces organization scope.
 */
export default async function EditContactPage({
    params,
}: EditContactPageProps) {


    const {
        id: rawId,
    } = await params;


    if (!rawId?.trim()) {

        notFound();

    }


    const id =
        rawId.trim();



    const contact =
        await ContactsServiceInstance.details(
            id,
        );



    if (!contact) {

        notFound();

    }



    async function handleSubmit(
        values: CreateContactInput,
    ): Promise<void> {

        'use server';


        await updateContact(
            id,
            values,
        );


        redirect(
            `/crm/contacts/${id}`,
        );

    }



    return (

        <CRMPageLayout>


            <CRMHeader

                title="Edit Contact"

                description="Update CRM contact details."

                actions={[
                    {
                        label: 'Back',
                        href: `/crm/contacts/${id}`,
                    },
                ]}

            />



            <ContactsForm

                initialValues={
                    contact
                }

                loading={
                    false
                }

                onSubmit={
                    handleSubmit
                }

            />


        </CRMPageLayout>

    );

}