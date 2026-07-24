import type {
    ClientPortal,
    ClientPortalSummary,
} from '@/types/crm/ClientPortal';



class ClientPortalRepository {


    private clientPortals =
        new Map<string, ClientPortal>();



    async list(): Promise<ClientPortal[]> {

        return Array.from(
            this.clientPortals.values()
        )
        .filter(
            portal =>
                !portal.isDeleted
        );

    }



    async listArchived(): Promise<ClientPortal[]> {

        return Array.from(
            this.clientPortals.values()
        )
        .filter(
            portal =>
                portal.isDeleted
        );

    }



    async findById(
        id: string
    ): Promise<ClientPortal | null> {

        return (
            this.clientPortals.get(id)
            ??
            null
        );

    }



    async create(
        data: Partial<ClientPortal>
    ): Promise<ClientPortal> {


        const now =
            new Date()
            .toISOString();



        const portal: ClientPortal = {


            id:
                crypto.randomUUID(),



            organizationId:
                data.organizationId,



            portalNumber:
                data.portalNumber
                ??
                `CP-${Date.now()}`,



            clientId:
                data.clientId,



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



        this.clientPortals.set(
            portal.id,
            portal
        );



        return portal;

    }



    async update(
        id: string,
        data: Partial<ClientPortal>
    ): Promise<ClientPortal | null> {


        const existing =
            this.clientPortals.get(id);



        if (!existing) {

            return null;

        }



        const updated: ClientPortal = {

            ...existing,

            ...data,

            updatedAt:
                new Date()
                .toISOString(),

        };



        this.clientPortals.set(
            id,
            updated
        );



        return updated;

    }



    async delete(
        id: string
    ): Promise<boolean> {


        const portal =
            this.clientPortals.get(id);



        if (!portal) {

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



        this.clientPortals.set(
            id,
            portal
        );



        return true;

    }



    async restore(
        id: string
    ): Promise<boolean> {


        const portal =
            this.clientPortals.get(id);



        if (!portal) {

            return false;

        }



        portal.isDeleted =
            false;



        portal.deletedAt =
            null;



        portal.deletedBy =
            null;



        if (
            portal.status ===
            'Archived'
        ) {

            portal.status =
                'Active';

        }



        portal.updatedAt =
            new Date()
            .toISOString();



        this.clientPortals.set(
            id,
            portal
        );



        return true;

    }



    async search(
        filters?: {

            status?: ClientPortal['status'];

            search?: string;

        }

    ): Promise<ClientPortal[]> {


        let portals =
            await this.list();



        if (filters?.status) {

            portals =
                portals.filter(
                    portal =>
                        portal.status ===
                        filters.status
                );

        }



        if (filters?.search) {


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



    async summary(): Promise<ClientPortalSummary> {


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



export const ClientPortalRepositoryInstance =
    new ClientPortalRepository();