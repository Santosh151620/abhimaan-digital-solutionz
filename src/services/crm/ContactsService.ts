import {
    createClient,
} from '@/lib/supabase/server';

import {
    createContactsRepository,
} from '@/repositories/crm/ContactsRepository';

import type {
    Contact,
    ContactDetails,
} from '@/types/crm/Contacts';



interface ContactSearchFilters {

    search?: string;

    status?: Contact['status'];

    companyId?: string;

}



class ContactsService {


    private async repository() {

        const supabase =
            await createClient();


        return createContactsRepository(
            supabase,
        );

    }



    async list(): Promise<Contact[]> {

        const repository =
            await this.repository();


        return repository.list();

    }



    async listArchived(): Promise<Contact[]> {

        const repository =
            await this.repository();


        return repository.listArchived();

    }



    async findById(
        id: string,
    ): Promise<Contact | null> {

        const repository =
            await this.repository();


        return repository.findById(
            id,
        );

    }



    async details(
        id: string,
    ): Promise<ContactDetails | null> {

        const repository =
            await this.repository();


        return repository.details(
            id,
        );

    }



    async search(
        filters?: ContactSearchFilters,
    ): Promise<Contact[]> {

        const repository =
            await this.repository();


        return repository.search(
            filters,
        );

    }



    async create(
        data: Partial<Contact>,
    ): Promise<Contact> {


        const repository =
            await this.repository();



        return repository.create(

            {

                firstName:
                    data.firstName
                    ??
                    '',


                lastName:
                    data.lastName
                    ??
                    '',


                entityType:
                    'Contact',


                ...data,


                status:
                    data.status
                    ??
                    'ACTIVE',

            },

        );

    }



    async update(
        id: string,

        data: Partial<Contact>,

    ): Promise<Contact> {


        const repository =
            await this.repository();


        return repository.update(

            id,

            {

                ...data,


                entityType:
                    'Contact',

            },

        );

    }



    async delete(
        id: string,
    ): Promise<void> {

        const repository =
            await this.repository();


        await repository.delete(
            id,
        );

    }



    async restore(
        id: string,
    ): Promise<boolean> {

        const repository =
            await this.repository();


        return repository.restore(
            id,
        );

    }



    async summary() {

        const repository =
            await this.repository();


        return repository.summary();

    }


}



export const ContactsServiceInstance =
    new ContactsService();