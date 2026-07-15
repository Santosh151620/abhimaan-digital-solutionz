import { notFound } from 'next/navigation';

import EditContactClient from './EditContactClient';
import { ContactsServiceInstance } from '@/services/crm/ContactsService';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditContactPage({
    params,
}: Props) {

    const { id } = await params;

    const contact =
        await ContactsServiceInstance.details(id);

    if (!contact) {
        notFound();
    }

    return (
        <EditContactClient
            contact={contact}
        />
    );

}