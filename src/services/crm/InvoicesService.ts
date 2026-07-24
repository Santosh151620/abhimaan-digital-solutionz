import {
    InvoicesRepositoryInstance,
} from '@/repositories/crm/InvoicesRepository';


import type {
    Invoice,
    InvoiceStatus,
} from '@/types/crm/Invoices';



export class InvoicesService {


    list(){

        return InvoicesRepositoryInstance.list();

    }



    listArchived(){

        return InvoicesRepositoryInstance.listArchived();

    }



    findById(
        id:string
    ){

        return InvoicesRepositoryInstance.findById(id);

    }



    details(
        id:string
    ){

        return this.findById(id);

    }



    create(
        data:Partial<Invoice>
    ){

        return InvoicesRepositoryInstance.create(data);

    }



    update(
        id:string,
        data:Partial<Invoice>
    ){

        return InvoicesRepositoryInstance.update(
            id,
            data
        );

    }



    updateStatus(
        id:string,
        status:InvoiceStatus
    ){

        return InvoicesRepositoryInstance.updateStatus(
            id,
            status
        );

    }



    delete(
        id:string
    ){

        return InvoicesRepositoryInstance.delete(id);

    }



    restore(
        id:string
    ){

        return InvoicesRepositoryInstance.restore(id);

    }



    summary(){

        return InvoicesRepositoryInstance.summary();

    }

}



export async function createInvoicesService(){

    return new InvoicesService();

}



export const InvoicesServiceInstance =
    new InvoicesService();
