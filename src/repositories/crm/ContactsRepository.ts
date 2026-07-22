import type {
    Contact,
    ContactDetails,
} from '@/types/crm/Contacts';

const contacts: ContactDetails[] = [];

export interface ContactSearchFilters {
    search?: string;
    status?: ContactDetails['status'];
    companyId?: string;
}

export interface ContactsSummary {
    total: number;
    active: number;
    inactive: number;
    archived: number;
}

export class ContactsRepository {

    async list(): Promise<Contact[]> {

        return contacts
            .filter(contact => !contact.isDeleted);

    }

    async listArchived(): Promise<Contact[]> {

        return contacts
            .filter(contact => contact.isDeleted);

    }

    async search(
        filters?: ContactSearchFilters,
    ): Promise<Contact[]> {

        let result =
            contacts.filter(
                contact => !contact.isDeleted,
            );

        if (filters?.search) {

            const keyword =
                filters.search.toLowerCase();

            result = result.filter(contact =>
                (contact.fullName ?? '')
                    .toLowerCase()
                    .includes(keyword)

                ||

                (contact.email ?? '')
                    .toLowerCase()
                    .includes(keyword)

                ||

                (contact.phone ?? '')
                    .toLowerCase()
                    .includes(keyword)

                ||

                (contact.companyName ?? '')
                    .toLowerCase()
                    .includes(keyword)
            );

        }

        if (filters?.status) {

            result = result.filter(
                contact =>
                    contact.status ===
                    filters.status,
            );

        }

        if (filters?.companyId) {

            result = result.filter(
                contact =>
                    contact.companyId ===
                    filters.companyId,
            );

        }

        return result;

    }

    async summary(): Promise<ContactsSummary> {

        return {

            total:
                contacts.filter(
                    x => !x.isDeleted,
                ).length,

            active:
                contacts.filter(
                    x =>
                        !x.isDeleted &&
                        x.status === 'ACTIVE',
                ).length,

            inactive:
                contacts.filter(
                    x =>
                        !x.isDeleted &&
                        x.status === 'INACTIVE',
                ).length,

            archived:
                contacts.filter(
                    x => x.isDeleted,
                ).length,

        };

    }

    async findById(
        id: string,
    ): Promise<ContactDetails | null> {

        return (
            contacts.find(
                x => x.id === id,
            ) ?? null
        );

    }

    async create(
        data: Partial<ContactDetails>,
    ): Promise<ContactDetails> {

        const now =
            new Date().toISOString();

        const contact: ContactDetails = {

            id: Date.now().toString(),

            firstName:
                data.firstName ?? '',

            lastName:
                data.lastName ?? '',

            fullName:
                `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim(),

            companyId:
                data.companyId,

            companyName:
                data.companyName,

            email:
                data.email,

            phone:
                data.phone,

            mobile:
                data.mobile,

            designation:
                data.designation,

            department:
                data.department,

            city:
                data.city,

            state:
                data.state,

            country:
                data.country,

            notes:
                data.notes,

            opportunities:
                data.opportunities ?? 0,

            lastActivity:
                data.lastActivity,

            status:
                data.status ?? 'ACTIVE',

            isDeleted: false,

            deletedAt: null,

            deletedBy: null,

            createdAt: now,

            updatedAt: now,

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
                x => x.id === id,
            );

        if (!contact) {
            return null;
        }

        Object.assign(
            contact,
            data,
        );

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
                x => x.id === id,
            );

        if (!contact) {
            return false;
        }

        contact.isDeleted = true;

        contact.deletedAt =
            new Date().toISOString();

        contact.status =
            'INACTIVE';

        return true;

    }

    async restore(
        id: string,
    ): Promise<boolean> {

        const contact =
            contacts.find(
                x => x.id === id,
            );

        if (!contact) {
            return false;
        }

        contact.isDeleted = false;

        contact.deletedAt = null;

        contact.deletedBy = null;

        contact.status = 'ACTIVE';

        contact.updatedAt =
            new Date().toISOString();

        return true;

    }

}

export const ContactsRepositoryInstance =
    new ContactsRepository();