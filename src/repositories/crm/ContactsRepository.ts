import type {
    SupabaseClient,
} from '@supabase/supabase-js';

import {
    BaseRepository,
} from '@/lib/db/base-repository';

import type {
    Contact,
    ContactDetails,
} from '@/types/crm/Contacts';



export interface ContactSearchFilters {

    search?: string;

    status?: Contact['status'];

    companyId?: string;

}



export interface ContactsSummary {

    total: number;

    active: number;

    inactive: number;

    leads: number;

    customers: number;

    archived: number;

}



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
            data ?? []
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
                );



        if (error) {

            throw error;

        }



        return (
            data ?? []
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

        } as ContactDetails;

    }
        async create(
        data: Partial<Contact>,
    ): Promise<Contact> {


        const payload: Partial<Contact> = {

            ...data,

            id:
                crypto.randomUUID(),

            entityType:
                'Contact',

            status:
                data.status
                ??
                'ACTIVE',

        };



        return super.create(
            payload,
        );

    }



    async update(
        id: string,

        data: Partial<Contact>,

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

                deletedAt:
                    new Date()
                        .toISOString(),

            },

        );

    }



    async restore(
        id: string,
    ): Promise<boolean> {


        await this.update(

            id,

            {

                status:
                    'ACTIVE',

                deletedAt:
                    undefined,

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



        if (filters?.search) {

            query =
                query.or(

                    [

                        `first_name.ilike.%${filters.search}%`,

                        `last_name.ilike.%${filters.search}%`,

                        `full_name.ilike.%${filters.search}%`,

                        `email.ilike.%${filters.search}%`,

                        `phone.ilike.%${filters.search}%`,

                    ].join(','),

                );

        }



        const {
            data,
            error,
        } =
            await query;



        if (error) {

            throw error;

        }



        return (

            data ?? []

        ) as Contact[];

    }



    async summary(): Promise<ContactsSummary> {


        const contacts =
            await this.list();



        return {

            total:
                contacts.length,


            active:
                contacts.filter(
                    contact =>
                        contact.status === 'ACTIVE',
                ).length,


            inactive:
                contacts.filter(
                    contact =>
                        contact.status === 'INACTIVE',
                ).length,


            leads:
                contacts.filter(
                    contact =>
                        contact.status === 'LEAD',
                ).length,


            customers:
                contacts.filter(
                    contact =>
                        contact.status === 'CUSTOMER',
                ).length,


            archived:
                (
                    await this.listArchived()
                ).length,

        };

    }
    }



export function createContactsRepository(
    supabase: SupabaseClient,
) {

    return new ContactsRepository(
        supabase,
    );

}
export const ContactsRepositoryInstance = null;