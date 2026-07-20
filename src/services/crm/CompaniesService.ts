import {
    CompaniesRepositoryInstance,
} from '@/repositories/crm/CompaniesRepository';



import type {
    Company,
    CompanyDetails,
} from '@/types/crm/Companies';



class CompaniesService {



    list() {

        return CompaniesRepositoryInstance.list();

    }





    listArchived() {

        return CompaniesRepositoryInstance.listArchived();

    }





    findById(
        id:string
    ) {

        return CompaniesRepositoryInstance.findById(
            id
        );

    }





    details(
        id:string
    ) {

        return this.findById(id);

    }





    search(
        filters?: {

            status?:Company['status'];

            industry?:string;

            search?:string;

        }
    ) {

        return CompaniesRepositoryInstance.search(
            filters
        );

    }





    create(
        data:Partial<CompanyDetails>
    ) {

        return CompaniesRepositoryInstance.create(
            data
        );

    }





    update(
        id:string,
        data:Partial<CompanyDetails>
    ) {

        return CompaniesRepositoryInstance.update(
            id,
            data
        );

    }





    delete(
        id:string
    ) {

        return CompaniesRepositoryInstance.delete(
            id
        );

    }





    restore(
        id:string
    ) {

        return CompaniesRepositoryInstance.restore(
            id
        );

    }





    summary() {

        return CompaniesRepositoryInstance.summary();

    }


}



export const
    CompaniesServiceInstance =
        new CompaniesService();