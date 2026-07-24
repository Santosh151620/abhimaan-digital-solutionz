import {
    QuotationsRepositoryInstance,
} from '@/repositories/crm/QuotationsRepository';


import type {
    Quotation,
    QuotationStatus,
} from '@/types/crm/Quotations';



export class QuotationsService {


    async list(){

        return QuotationsRepositoryInstance.list();

    }



    async listArchived(){

        return QuotationsRepositoryInstance.listArchived();

    }



    async findById(
        id:string
    ){

        return QuotationsRepositoryInstance.findById(id);

    }



    async details(
        id:string
    ){

        return this.findById(id);

    }



    async create(
        data:Partial<Quotation>
    ){

        return QuotationsRepositoryInstance.create(data);

    }



    async update(
        id:string,
        data:Partial<Quotation>
    ){

        return QuotationsRepositoryInstance.update(
            id,
            data
        );

    }



    async delete(
        id:string
    ){

        return QuotationsRepositoryInstance.delete(id);

    }



    async restore(
        id:string
    ){

        return QuotationsRepositoryInstance.restore(id);

    }



    async updateStatus(
        id:string,
        status:QuotationStatus
    ){

        return QuotationsRepositoryInstance.updateStatus(
            id,
            status
        );

    }



    async search(
        filters?:{
            status?:QuotationStatus;
            search?:string;
        }
    ){

        return QuotationsRepositoryInstance.search(
            filters
        );

    }



    async summary(){

        const summary =
            await QuotationsRepositoryInstance.summary();


        return {

            ...summary,


            // backward compatibility
            // existing reports/dashboard components
            value:
                summary.totalValue,

        };

    }


}



export const QuotationsServiceInstance =
    new QuotationsService();