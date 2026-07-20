import {
    listContacts,
} from './actions';

export default async function ContactsPage() {

    const contacts =
        await listContacts();

    return (

        <div>

            <div>

                <h1 className="text-3xl font-bold">
                    Contacts
                </h1>

                <p className="text-muted-foreground">
                    CRM Contacts
                </p>

            </div>

            <div className="rounded-xl border">

                <table className="w-full">

                    <thead>

                        <tr className="border-b">

                            <th className="p-3 text-left">
                                Name
                            </th>

                            <th className="p-3 text-left">
                                Company
                            </th>

                            <th className="p-3 text-left">
                                Email
                            </th>

                            <th className="p-3 text-left">
                                Phone
                            </th>

                            <th className="p-3 text-left">
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {contacts.map(contact => (

                            <tr
                                key={contact.id}
                                className="border-b"
                            >

                                <td className="p-3">
                                    {contact.firstName} {contact.lastName}
                                </td>

                                <td className="p-3">
                                    {contact.companyId ?? '-'}
                                </td>

                                <td className="p-3">
                                    {contact.email}
                                </td>

                                <td className="p-3">
                                    {contact.phone}
                                </td>

                                <td className="p-3">
                                    {contact.status}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}