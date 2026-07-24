import type {
    CustomerPortal,
    CustomerPortalSummary,
} from '@/types/crm/CustomerPortal';



class CustomerPortalRepository {



    private customerPortals =
        new Map<string, CustomerPortal>();



    async list(): Promise<CustomerPortal[]> {

        return Array.from(
            this.customerPortals.values()
        )
        .filter(
            portal =>
                !portal.isDeleted
        );

    }



    async listArchived(): Promise<CustomerPortal[]> {

        return Array.from(
            this.customerPortals.values()
        )
        .filter(
            portal =>
                portal.isDeleted
        );

    }



    async findById(
        id:string
    ):Promise<CustomerPortal | null> {


        return (
            this.customerPortals.get(id)
            ??
            null
        );

    }



    async create(
        data:Partial<CustomerPortal>
    ):Promise<CustomerPortal> {


        const now =
            new Date()
            .toISOString();



        const portal:CustomerPortal = {


            id:
                crypto.randomUUID(),



            organizationId:
                data.organizationId,



            customerPortalNumber:
                data.customerPortalNumber
                ??
                `CUSTOMER-PORTAL-${Date.now()}`,



            customerId:
                data.customerId,



            name:
                data.name
                ??
                '',



            email:
                data.email,



            status:
                data.status
                ??
                'Pending',



            accessEnabled:
                data.accessEnabled
                ??
                false,



            entityType:
                data.entityType,



            entityId:
                data.entityId,



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



        this.customerPortals.set(
            portal.id,
            portal
        );



        return portal;

    }



    async update(
        id:string,
        data:Partial<CustomerPortal>
    ):Promise<CustomerPortal | null> {


        const existing =
            this.customerPortals.get(id);



        if(!existing){

            return null;

        }



        const updated:CustomerPortal = {

            ...existing,

            ...data,

            updatedAt:
                new Date()
                .toISOString(),

        };



        this.customerPortals.set(
            id,
            updated
        );



        return updated;

    }



    async delete(
        id:string
    ):Promise<boolean> {


        const portal =
            this.customerPortals.get(id);



        if(!portal){

            return false;

        }



        portal.isDeleted =
            true;



        portal.status =
            'Archived';



        portal.deletedAt =
            new Date()
            .toISOString();



        portal.updatedAt =
            new Date()
            .toISOString();



        this.customerPortals.set(
            id,
            portal
        );



        return true;

    }



    async restore(
        id:string
    ):Promise<boolean> {


        const portal =
            this.customerPortals.get(id);



        if(!portal){

            return false;

        }



        portal.isDeleted =
            false;



        portal.deletedAt =
            null;



        portal.deletedBy =
            null;



        if(
            portal.status ===
            'Archived'
        ){

            portal.status =
                'Active';

        }



        portal.updatedAt =
            new Date()
            .toISOString();



        this.customerPortals.set(
            id,
            portal
        );



        return true;

    }



    async search(
        filters?: {

            status?: CustomerPortal['status'];

            search?: string;

        }

    ):Promise<CustomerPortal[]> {


        let portals =
            await this.list();



        if(filters?.status){

            portals =
                portals.filter(
                    portal =>
                        portal.status ===
                        filters.status
                );

        }



        if(filters?.search){


            const keyword =
                filters.search
                .toLowerCase();



            portals =
                portals.filter(
                    portal =>

                        portal.name
                        .toLowerCase()
                        .includes(keyword)

                        ||

                        portal.email
                        ?.toLowerCase()
                        .includes(keyword)

                );

        }



        return portals;

    }



    async summary():Promise<CustomerPortalSummary> {


        const portals =
            await this.list();



        const archived =
            await this.listArchived();



        return {


            total:
                portals.length,



            active:
                portals.filter(
                    portal =>
                        portal.status ===
                        'Active'
                )
                .length,



            inactive:
                portals.filter(
                    portal =>
                        portal.status ===
                        'Inactive'
                )
                .length,



            archived:
                archived.length,

        };

    }


}



export const CustomerPortalRepositoryInstance =
    new CustomerPortalRepository();