import { notFound } from 'next/navigation';

import { ContactsServiceInstance } from '@/services/crm/ContactsService';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function ContactPage({
    params,
}: Props) {

    const { id } = await params;

    const contact =
        await ContactsServiceInstance.details(id);

    if (!contact) {
        notFound();
    }

    return (
        <div className="space-y-4">

            <h1 className="text-3xl font-bold">
                {contact.firstName} {contact.lastName}
            </h1>

            <p>{contact.email}</p>

            <p>{contact.phone}</p>

            <p>{contact.designation}</p>

            <p>{contact.status}</p>

        </div>
    );

}