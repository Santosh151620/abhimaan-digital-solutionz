import { ContactsRepositoryInstance } from "@/repositories/crm/ContactsRepository";
import type { ContactDetails } from "@/types/crm/Contacts";

export class ContactsService {

    async list() {
        return ContactsRepositoryInstance.list();
    }

    async listArchived() {
        return ContactsRepositoryInstance.listArchived();
    }

    async details(
        id: string,
    ) {
        return ContactsRepositoryInstance.findById(id);
    }

    async create(
        data: Partial<ContactDetails>,
    ) {
        return ContactsRepositoryInstance.create(data);
    }

    async update(
        id: string,
        data: Partial<ContactDetails>,
    ) {
        return ContactsRepositoryInstance.update(
            id,
            data,
        );
    }

    async delete(
        id: string,
    ) {
        return ContactsRepositoryInstance.delete(id);
    }

    async restore(
        id: string,
    ) {
        return ContactsRepositoryInstance.restore(id);
    }

}

export const ContactsServiceInstance =
    new ContactsService();




