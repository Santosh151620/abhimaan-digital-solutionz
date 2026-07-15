import type {
    Contact,
    ContactDetails,
} from "@/types/crm/Contacts";

const contacts: ContactDetails[] = [];

export class ContactsRepository {

    async list(): Promise<Contact[]> {

        return contacts.filter(
            x => !x.isDeleted
        );

    }

    async listArchived(): Promise<Contact[]> {

        return contacts.filter(
            x => x.isDeleted
        );

    }

    async findById(
        id: string,
    ): Promise<ContactDetails | null> {

        return (
            contacts.find(
                x => x.id === id
            ) ?? null
        );

    }

    async create(
        data: Partial<ContactDetails>,
    ): Promise<ContactDetails> {

        const contact: ContactDetails = {

            id: Date.now().toString(),

            firstName:
                data.firstName ?? "",

            lastName:
                data.lastName ?? "",

            fullName:
                `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim(),

            companyId: data.companyId,

            companyName:
                data.companyName,

            email: data.email,
            phone: data.phone,
            mobile: data.mobile,

            designation:
                data.designation,

            department:
                data.department,

            city: data.city,
            state: data.state,
            country: data.country,

            notes: data.notes,

            opportunities:
                data.opportunities ?? 0,

            lastActivity:
                data.lastActivity,

            status:
                data.status ?? "ACTIVE",

            isDeleted: false,
            deletedAt: null,
            deletedBy: null,

            createdAt:
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString(),

        };

        contacts.push(contact);

        return contact;

    }

    async update(
        id: string,
        data: Partial<ContactDetails>,
    ): Promise<ContactDetails | null> {

        const contact =
            contacts.find(
                x => x.id === id
            );

        if (!contact) {
            return null;
        }

        Object.assign(contact, data);

        contact.fullName =
            `${contact.firstName} ${contact.lastName}`.trim();

        contact.updatedAt =
            new Date().toISOString();

        return contact;

    }

    async delete(
        id: string,
    ): Promise<boolean> {

        const contact =
            contacts.find(
                x => x.id === id
            );

        if (!contact) {
            return false;
        }

        contact.isDeleted = true;

        contact.deletedAt =
            new Date().toISOString();

        contact.status =
            "INACTIVE";

        return true;

    }

    async restore(
        id: string,
    ): Promise<boolean> {

        const contact =
            contacts.find(
                x => x.id === id
            );

        if (!contact) {
            return false;
        }

        contact.isDeleted = false;

        contact.deletedAt = null;

        contact.deletedBy = null;

        contact.status = "ACTIVE";

        contact.updatedAt =
            new Date().toISOString();

        return true;

    }

}

export const ContactsRepositoryInstance =
    new ContactsRepository();




