import {
    ContactsRepositoryInstance,
} from '@/repositories/crm/ContactsRepository';

import type {
    Contact,
    ContactDetails,
} from '@/types/crm/Contacts';

export class ContactsService {

    async list(): Promise<Contact[]> {

        return ContactsRepositoryInstance.list();

    }

    async listArchived(): Promise<Contact[]> {

        return ContactsRepositoryInstance.listArchived();

    }

    async details(
        id: string,
    ): Promise<ContactDetails | null> {

        return ContactsRepositoryInstance.findById(
            id,
        );

    }

    async findById(
        id: string,
    ): Promise<ContactDetails | null> {

        return this.details(id);

    }

    async create(
        data: Partial<ContactDetails>,
    ): Promise<ContactDetails> {

        return ContactsRepositoryInstance.create(
            data,
        );

    }

    async update(
        id: string,
        data: Partial<ContactDetails>,
    ): Promise<ContactDetails | null> {

        return ContactsRepositoryInstance.update(
            id,
            data,
        );

    }

    async delete(
        id: string,
    ): Promise<boolean> {

        return ContactsRepositoryInstance.delete(
            id,
        );

    }

    async restore(
        id: string,
    ): Promise<boolean> {

        return ContactsRepositoryInstance.restore(
            id,
        );

    }

}

export const ContactsServiceInstance =
    new ContactsService();