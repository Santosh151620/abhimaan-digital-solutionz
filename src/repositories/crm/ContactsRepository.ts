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

    archived: number;

}




class ContactsRepository {


    private contacts =
        new Map<string, ContactDetails>();



    async list(): Promise<ContactDetails[]> {

        return Array.from(
            this.contacts.values()
        )
        .filter(
            contact =>
                !contact.isDeleted
        );

    }



    async listArchived(): Promise<ContactDetails[]> {

        return Array.from(
            this.contacts.values()
        )
        .filter(
            contact =>
                contact.isDeleted
        );

    }



    async findById(
        id:string
    ):Promise<ContactDetails | null> {


        return (

            this.contacts.get(id)

            ??

            null

        );

    }



    async search(
        filters?: ContactSearchFilters
    ):Promise<ContactDetails[]> {


        let result =
            await this.list();



        if(filters?.search){


            const keyword =
                filters.search.toLowerCase();



            result =
                result.filter(
                    contact =>


                        (
                            contact.fullName
                            ??
                            ''
                        )
                        .toLowerCase()
                        .includes(keyword)


                        ||


                        (
                            contact.email
                            ??
                            ''
                        )
                        .toLowerCase()
                        .includes(keyword)


                        ||


                        (
                            contact.phone
                            ??
                            ''
                        )
                        .toLowerCase()
                        .includes(keyword)


                        ||


                        (
                            contact.companyName
                            ??
                            ''
                        )
                        .toLowerCase()
                        .includes(keyword)

                );

        }




        if(filters?.status){


            result =
                result.filter(
                    contact =>
                        contact.status ===
                        filters.status
                );

        }




        if(filters?.companyId){


            result =
                result.filter(
                    contact =>
                        contact.companyId ===
                        filters.companyId
                );

        }



        return result;

    }





    async summary():Promise<ContactsSummary>{


        const contacts =
            Array.from(
                this.contacts.values()
            );



        return {


            total:

                contacts.filter(
                    contact =>
                        !contact.isDeleted
                ).length,



            active:

                contacts.filter(
                    contact =>
                        !contact.isDeleted
                        &&
                        contact.status === 'ACTIVE'
                ).length,



            inactive:

                contacts.filter(
                    contact =>
                        !contact.isDeleted
                        &&
                        contact.status === 'INACTIVE'
                ).length,



            archived:

                contacts.filter(
                    contact =>
                        contact.isDeleted
                ).length,


        };

    }





    async create(
        data:Partial<ContactDetails>
    ):Promise<ContactDetails>{



        const now =
            new Date().toISOString();



        const contact:ContactDetails = {


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

            contact

        );



        return contact;

    }





    async update(
        id:string,
        data:Partial<ContactDetails>
    ):Promise<ContactDetails | null>{



        const contact =
            this.contacts.get(id);



        if(!contact){

            return null;

        }



        Object.assign(

            contact,

            data

        );



        contact.fullName =

            `${contact.firstName} ${contact.lastName}`
                .trim();



        contact.updatedAt =
            new Date().toISOString();



        this.contacts.set(

            id,

            contact

        );



        return contact;

    }





    async delete(
        id:string
    ):Promise<boolean>{


        const contact =
            this.contacts.get(id);



        if(!contact){

            return false;

        }



        contact.isDeleted = true;


        contact.deletedAt =
            new Date().toISOString();



        contact.status =
            'INACTIVE';



        contact.updatedAt =
            new Date().toISOString();



        return true;

    }





    async restore(
        id:string
    ):Promise<boolean>{


        const contact =
            this.contacts.get(id);



        if(!contact){

            return false;

        }



        contact.isDeleted = false;


        contact.deletedAt = null;


        contact.deletedBy = null;



        contact.status =
            'ACTIVE';



        contact.updatedAt =
            new Date().toISOString();



        return true;

    }


}



export const ContactsRepositoryInstance =
    new ContactsRepository();