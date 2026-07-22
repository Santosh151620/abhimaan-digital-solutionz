import {
    CompaniesRepositoryInstance,
} from '@/repositories/crm/CompaniesRepository';


import type {
    Company,
    CompanyDetails,
} from '@/types/crm/Companies';



class CompaniesService {


    async list(): Promise<CompanyDetails[]> {

        return CompaniesRepositoryInstance.list();

    }



    async listArchived(): Promise<CompanyDetails[]> {

        return CompaniesRepositoryInstance.listArchived();

    }



    async findById(
        id:string
    ):Promise<CompanyDetails | null>{

        return CompaniesRepositoryInstance.findById(
            id
        );

    }



    async details(
        id:string
    ):Promise<CompanyDetails | null>{

        return this.findById(id);

    }



    async search(
        filters?:{

            status?: Company['status'];

            industry?: string;

            search?: string;

        }

    ):Promise<CompanyDetails[]>{

        return CompaniesRepositoryInstance.search(
            filters
        );

    }



    async create(
        data:Partial<CompanyDetails>
    ):Promise<CompanyDetails>{

        return CompaniesRepositoryInstance.create(
            data
        );

    }



    async update(
        id:string,
        data:Partial<CompanyDetails>
    ):Promise<CompanyDetails | null>{

        return CompaniesRepositoryInstance.update(
            id,
            data
        );

    }



    async delete(
        id:string
    ):Promise<boolean>{

        return CompaniesRepositoryInstance.delete(
            id
        );

    }



    async restore(
        id:string
    ):Promise<boolean>{

        return CompaniesRepositoryInstance.restore(
            id
        );

    }



    async summary(){

        return CompaniesRepositoryInstance.summary();

    }


}



export const CompaniesServiceInstance =
    new CompaniesService();