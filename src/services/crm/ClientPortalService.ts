import {
    ClientPortalRepositoryInstance,
} from '@/repositories/crm/ClientPortalRepository';



import type {
    ClientPortal,
    ClientPortalSummary,
} from '@/types/crm/ClientPortal';





class ClientPortalService {



    async list():Promise<ClientPortal[]> {


        return ClientPortalRepositoryInstance.list();

    }





    async listArchived():Promise<ClientPortal[]> {


        return ClientPortalRepositoryInstance.listArchived();

    }





    async findById(
        id:string
    ):Promise<ClientPortal | null>{


        return ClientPortalRepositoryInstance.findById(
            id
        );

    }





    async search(
        filters?:{

            status?:ClientPortal['status'];

            search?:string;

        }

    ):Promise<ClientPortal[]> {


        return ClientPortalRepositoryInstance.search(
            filters
        );

    }





    async create(
        data:Partial<ClientPortal>
    ):Promise<ClientPortal>{


        return ClientPortalRepositoryInstance.create(
            data
        );

    }





    async update(
        id:string,
        data:Partial<ClientPortal>
    ):Promise<ClientPortal | null>{


        return ClientPortalRepositoryInstance.update(
            id,
            data
        );

    }





    async delete(
        id:string
    ):Promise<boolean>{


        return ClientPortalRepositoryInstance.delete(
            id
        );

    }





    async restore(
        id:string
    ):Promise<boolean>{


        return ClientPortalRepositoryInstance.restore(
            id
        );

    }





    async summary():Promise<ClientPortalSummary>{


        return ClientPortalRepositoryInstance.summary();

    }



}





export const ClientPortalServiceInstance =
    new ClientPortalService();
