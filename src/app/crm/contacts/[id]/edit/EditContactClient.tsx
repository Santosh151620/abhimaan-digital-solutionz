'use client';

import { useRouter } from 'next/navigation';

import { ContactsForm } from '@/components/crm/contacts';
import { updateContact } from '../../actions';

import type { Contact } from '@/types/crm/Contacts';

interface Props {
    contact: Contact;
}

export default function EditContactClient({
    contact,
}: Props) {

    const router = useRouter();

    return (
        <ContactsForm
            initialValues= { contact }
    onSubmit = { async values => {
        await updateContact(
            contact.id,
            values,
        );
        router.push('/crm/contacts');
        router.refresh();
    }
}
onCancel = {() => router.back()}
        />
    );

}