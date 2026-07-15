'use client';

import { useRouter } from 'next/navigation';

import { ContactsForm } from '@/components/crm/contacts';
import { createContact } from '../actions';

export default function NewContactPage() {

    const router = useRouter();

    return (
        <ContactsForm
            onSubmit={async values => {
                await createContact(values);
                router.push('/crm/contacts');
                router.refresh();
            }}
            onCancel={() =>
                router.push('/crm/contacts')
            }
        />
    );

}




