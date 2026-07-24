import type {
    ContactDetails,
} from '@/types/crm/Contacts';



export interface ContactSearchFilters {

    search?: string;

    status?: ContactDetails['status'];

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





class ContactsRepository {


    private contacts =
        new Map<string, ContactDetails>();




    async list(): Promise<ContactDetails[]> {


        return Array.from(
            this.contacts.values(),
        )
        .filter(
            contact =>
                !contact.isDeleted,
        );

    }




    async listArchived(): Promise<ContactDetails[]> {


        return Array.from(
            this.contacts.values(),
        )
        .filter(
            contact =>
                contact.isDeleted === true,
        );

    }




    async findById(
        id: string,
    ): Promise<ContactDetails | null> {


        return (
            this.contacts.get(id)
            ??
            null
        );

    }




    async search(
        filters?: ContactSearchFilters,
    ): Promise<ContactDetails[]> {


        let result =
            await this.list();




        if (filters?.search) {


            const keyword =
                filters.search
                    .trim()
                    .toLowerCase();




            result =
                result.filter(
                    contact => {


                        const searchable = [

                            contact.fullName,

                            contact.firstName,

                            contact.lastName,

                            contact.email,

                            contact.phone,

                            contact.mobile,

                            contact.companyName,

                        ]
                        .filter(Boolean)
                        .join(' ')
                        .toLowerCase();




                        return searchable.includes(
                            keyword,
                        );

                    },
                );

        }




        if (filters?.status) {


            result =
                result.filter(
                    contact =>
                        contact.status === filters.status,
                );

        }




        if (filters?.companyId) {


            result =
                result.filter(
                    contact =>
                        contact.companyId === filters.companyId,
                );

        }




        return result;

    }





    async summary(): Promise<ContactsSummary> {


        const contacts =
            Array.from(
                this.contacts.values(),
            );



        const activeContacts =
            contacts.filter(
                contact =>
                    !contact.isDeleted,
            );



        return {


            total:
                activeContacts.length,



            active:
                activeContacts.filter(
                    contact =>
                        contact.status === 'ACTIVE',
                ).length,



            inactive:
                activeContacts.filter(
                    contact =>
                        contact.status === 'INACTIVE',
                ).length,



            leads:
                activeContacts.filter(
                    contact =>
                        contact.status === 'LEAD',
                ).length,



            customers:
                activeContacts.filter(
                    contact =>
                        contact.status === 'CUSTOMER',
                ).length,



            archived:
                contacts.filter(
                    contact =>
                        contact.isDeleted === true,
                ).length,


        };

    }





    async create(
        data: Partial<ContactDetails>,
    ): Promise<ContactDetails> {


        const now =
            new Date().toISOString();




        const contact: ContactDetails = {


            id:
                crypto.randomUUID(),



            organizationId:
                data.organizationId,



            companyId:
                data.companyId,



            firstName:
                data.firstName
                ??
                '',



            lastName:
                data.lastName
                ??
                '',



            fullName:

                `${data.firstName ?? ''} ${data.lastName ?? ''}`
                    .trim(),



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
                data.opportunities
                ??
                0,



            lastActivity:
                data.lastActivity,



            status:
                data.status
                ??
                'ACTIVE',



            isDeleted:
                false,



            deletedAt:
                null,



            deletedBy:
                null,



            createdAt:
                now,



            updatedAt:
                now,


        };




        this.contacts.set(
            contact.id,
            contact,
        );



        return contact;

    }





    async update(
        id: string,
        data: Partial<ContactDetails>,
    ): Promise<ContactDetails | null> {


        const existing =
            this.contacts.get(id);



        if (!existing) {

            return null;

        }




        const updated: ContactDetails = {


            ...existing,

            ...data,



            fullName:

                `${data.firstName ?? existing.firstName} ${data.lastName ?? existing.lastName}`
                    .trim(),



            updatedAt:
                new Date().toISOString(),


        };




        this.contacts.set(
            id,
            updated,
        );



        return updated;

    }





    async delete(
        id: string,
    ): Promise<boolean> {


        const contact =
            this.contacts.get(id);



        if (!contact) {

            return false;

        }




        contact.isDeleted = true;



        contact.deletedAt =
            new Date().toISOString();



        contact.status =
            'INACTIVE';



        contact.updatedAt =
            new Date().toISOString();




        this.contacts.set(
            id,
            contact,
        );



        return true;

    }





    async restore(
        id: string,
    ): Promise<boolean> {


        const contact =
            this.contacts.get(id);



        if (!contact) {

            return false;

        }




        contact.isDeleted = false;



        contact.deletedAt = null;



        contact.deletedBy = null;



        contact.status =
            'ACTIVE';



        contact.updatedAt =
            new Date().toISOString();




        this.contacts.set(
            id,
            contact,
        );



        return true;

    }


}





export const ContactsRepositoryInstance =
    new ContactsRepository();