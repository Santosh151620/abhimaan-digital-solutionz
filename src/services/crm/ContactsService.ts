import {
    createClient,
} from "@/lib/supabase/server";


import {
    createContactsRepository,
} from "@/repositories/crm/ContactsRepository";


import type {
    Contact,
    ContactDetails,
    ContactSearchFilters,
    CreateContactInput,
    UpdateContactInput,
    ContactsSummary,
} from "@/types/crm/Contacts";




export class ContactsService {


    private async repository() {

        const supabase =
            await createClient();


        return createContactsRepository(
            supabase,
        );

    }






    async list():Promise<Contact[]> {


        const repository =
            await this.repository();


        return repository.list();

    }






    async listArchived():Promise<Contact[]> {


        const repository =
            await this.repository();


        return repository.listArchived();

    }






    async findById(
        id:string,
    ):Promise<Contact | null> {


        const repository =
            await this.repository();


        return repository.findById(
            id,
        );

    }






    async details(
        id:string,
    ):Promise<ContactDetails | null> {


        const repository =
            await this.repository();


        return repository.details(
            id,
        );

    }






    async get(
        id:string,
    ):Promise<Contact | null> {


        return this.findById(
            id,
        );

    }






    async search(
        filters?:ContactSearchFilters,
    ):Promise<Contact[]> {


        const repository =
            await this.repository();


        return repository.search(
            filters,
        );

    }






    async create(
        data:CreateContactInput,
    ):Promise<Contact> {


        const repository =
            await this.repository();


        return repository.create(
            data,
        );

    }






    async update(
        id:string,

        data:UpdateContactInput,

    ):Promise<Contact> {


        const repository =
            await this.repository();


        return repository.update(

            id,

            data,

        );

    }






    async delete(
        id:string,
    ):Promise<void> {


        const repository =
            await this.repository();


        await repository.delete(
            id,
        );

    }






    async restore(
        id:string,
    ):Promise<boolean> {


        const repository =
            await this.repository();


        return repository.restore(
            id,
        );

    }






    async summary():Promise<ContactsSummary> {


        const repository =
            await this.repository();


        return repository.summary();

    }


}







/**
 * Production factory
 */
export function createContactsService() {


    return new ContactsService();

}







/**
 * Application singleton
 *
 * Used by:
 * - Server components
 * - Actions
 * - API routes
 */
export const ContactsServiceInstance =
    new ContactsService();







/**
 * Legacy compatibility
 *
 * Existing imports continue working.
 */
export const contactsService =
    ContactsServiceInstance;