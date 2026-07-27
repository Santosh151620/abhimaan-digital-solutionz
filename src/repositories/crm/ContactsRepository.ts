import type {
    SupabaseClient,
} from '@supabase/supabase-js';


import {
    BaseRepository,
} from '@/lib/db/base-repository';


import type {
    Contact,
    ContactDetails,
    ContactSearchFilters,
    ContactsSummary,
    CreateContactInput,
    UpdateContactInput,
} from '@/types/crm/Contacts';




export class ContactsRepository
    extends BaseRepository<Contact> {



    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            'contacts',
        );

    }





    async list(): Promise<Contact[]> {


        const {
            data,
            error,
        } =
            await this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .neq(
                    'status',
                    'ARCHIVED',
                )
                .order(
                    'created_at',
                    {
                        ascending: false,
                    },
                );



        if (error) {

            throw error;

        }



        return (
            data ??
            []
        ) as Contact[];

    }







    async listArchived(): Promise<Contact[]> {


        const {
            data,
            error,
        } =
            await this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .eq(
                    'status',
                    'ARCHIVED',
                )
                .order(
                    'created_at',
                    {
                        ascending: false,
                    },
                );



        if (error) {

            throw error;

        }



        return (
            data ??
            []
        ) as Contact[];

    }







    async findById(
        id: string,
    ): Promise<Contact | null> {


        return super.findById(
            id,
        );

    }







    async details(
        id: string,
    ): Promise<ContactDetails | null> {


        const contact =
            await this.findById(
                id,
            );



        if (!contact) {

            return null;

        }



        return {

            ...contact,

        };

    }







    async create(
        data: CreateContactInput,
    ): Promise<Contact> {


        const now =
            new Date()
                .toISOString();



        return super.create({

            ...data,


            id:
                crypto.randomUUID(),



            entityType:
                'Contact',



            entityId:
                crypto.randomUUID(),



            status:
                data.status
                ??
                'ACTIVE',



            createdAt:
                now,


            updatedAt:
                now,


        });

    }







    async update(
        id: string,

        data: UpdateContactInput,

    ): Promise<Contact> {


        return super.update(

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


        await this.update(

            id,

            {

                status:
                    'ARCHIVED',


                isDeleted:
                    true,


                deletedAt:
                    new Date()
                        .toISOString(),

            },

        );

    }







    async restore(
        id: string,
    ): Promise<boolean> {


        const existing =
            await this.findById(
                id,
            );



        if (!existing) {

            return false;

        }



        await this.update(

            id,

            {

                status:
                    'ACTIVE',


                isDeleted:
                    false,


                deletedAt:
                    null,

            },

        );



        return true;

    }







    async search(
        filters?: ContactSearchFilters,
    ): Promise<Contact[]> {


        let query =
            this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId,
                );



        if (!filters?.includeArchived) {

            query =
                query.neq(
                    'status',
                    'ARCHIVED',
                );

        }





        if (filters?.status) {

            query =
                query.eq(
                    'status',
                    filters.status,
                );

        }





        if (filters?.companyId) {

            query =
                query.eq(
                    'company_id',
                    filters.companyId,
                );

        }





        if (filters?.ownerId) {

            query =
                query.eq(
                    'owner_id',
                    filters.ownerId,
                );

        }





        if (filters?.assignedTo) {

            query =
                query.eq(
                    'assigned_to',
                    filters.assignedTo,
                );

        }





        if (filters?.search) {


            const keyword =
                filters.search.trim();



            query =
                query.or(

                    [

                        `first_name.ilike.%${keyword}%`,

                        `last_name.ilike.%${keyword}%`,

                        `full_name.ilike.%${keyword}%`,

                        `email.ilike.%${keyword}%`,

                        `phone.ilike.%${keyword}%`,

                    ].join(','),

                );

        }





        const {
            data,
            error,
        } =
            await query.order(

                'created_at',

                {
                    ascending: false,
                },

            );



        if (error) {

            throw error;

        }



        return (

            data ??
            []

        ) as Contact[];

    }







    async summary(): Promise<ContactsSummary> {


        const contacts =
            await this.list();



        const archived =
            await this.listArchived();



        return {


            total:
                contacts.length,



            active:

                contacts.filter(
                    item =>
                        item.status === 'ACTIVE',
                ).length,



            inactive:

                contacts.filter(
                    item =>
                        item.status === 'INACTIVE',
                ).length,



            leads:

                contacts.filter(
                    item =>
                        item.status === 'LEAD',
                ).length,



            customers:

                contacts.filter(
                    item =>
                        item.status === 'CUSTOMER',
                ).length,



            archived:
                archived.length,


        };

    }


}






/**
 * Production factory
 */
export function createContactsRepository(
    supabase: SupabaseClient,
) {

    return new ContactsRepository(
        supabase,
    );

}





/**
 * Standard export
 */
export const ContactsRepositoryInstance =
    createContactsRepository;



/**
 * Legacy compatibility
 */
export const ContactRepositoryInstance =
    createContactsRepository;
