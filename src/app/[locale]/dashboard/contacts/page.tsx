import ContactsClient from "@/components/crm/contacts/ContactsClient";
import { ContactsServiceInstance } from "@/services/crm/ContactsService";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {

    const contacts =
        await ContactsServiceInstance.list();

    return (
        <div className="space-y-6">
            <ContactsClient
                initialContacts={contacts}
            />
        </div>
    );

}