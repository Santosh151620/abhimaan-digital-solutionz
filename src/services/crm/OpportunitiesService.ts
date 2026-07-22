import {
    OpportunitiesRepositoryInstance,
} from '@/repositories/crm/OpportunitiesRepository';


import type {
    Opportunity,
} from '@/types/crm/Opportunities';



class OpportunitiesService {


    async list() {

        return OpportunitiesRepositoryInstance.list();

    }




    async listArchived() {

        return OpportunitiesRepositoryInstance.listArchived();

    }




    async details(
        id:string
    ) {

        return OpportunitiesRepositoryInstance.details(id);

    }




    async findById(
        id:string
    ) {

        return OpportunitiesRepositoryInstance.findById(id);

    }




    async search(
        filters?: {

            stage?: Opportunity['stage'];

            companyId?: string;

            search?: string;

        }
    ) {

        return OpportunitiesRepositoryInstance.search(
            filters
        );

    }




    async create(
        data:Partial<Opportunity>
    ) {

        return OpportunitiesRepositoryInstance.create(
            data
        );

    }




    async update(
        id:string,
        data:Partial<Opportunity>
    ) {

        return OpportunitiesRepositoryInstance.update(
            id,
            data
        );

    }




    async delete(
        id:string
    ) {

        return OpportunitiesRepositoryInstance.delete(
            id
        );

    }




    async restore(
        id:string
    ) {

        return OpportunitiesRepositoryInstance.restore(
            id
        );

    }




    async summary() {

        return OpportunitiesRepositoryInstance.summary();

    }


}



export const OpportunitiesServiceInstance =
    new OpportunitiesService();