import type { Invoice } from '@/types/crm/Invoices';


class InvoicesRepository {


    private invoices: Invoice[] = [];


    async list(): Promise<Invoice[]> {

        return this.invoices.filter(
            invoice => !invoice.archived
        );

    }


    async listArchived(): Promise<Invoice[]> {

        return this.invoices.filter(
            invoice => invoice.archived
        );

    }


    async findById(
        id:string
    ):Promise<Invoice | null>{

        return (
            this.invoices.find(
                invoice=>invoice.id===id
            ) ?? null
        );

    }


    async create(
        data:Partial<Invoice>
    ):Promise<Invoice>{


        const invoice:Invoice = {

            id:crypto.randomUUID(),

            invoiceNumber:
                data.invoiceNumber ??
                `INV-${Date.now()}`,

            companyId:
                data.companyId ?? '',

            customerName:
                data.customerName ?? '',

            status:
                data.status ?? 'Draft',

            issueDate:
                data.issueDate ??
                new Date().toISOString(),

            dueDate:
                data.dueDate ??
                new Date().toISOString(),

            subtotal:
                data.subtotal ?? 0,

            tax:
                data.tax ?? 0,

            total:
                data.total ?? 0,

            currency:
                data.currency ?? 'INR',

            archived:false,

            createdAt:
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString(),

            contractId:data.contractId,

            quotationId:data.quotationId,

            paidAmount:data.paidAmount,

            balanceAmount:data.balanceAmount,

            notes:data.notes,

        };


        this.invoices.push(invoice);


        return invoice;

    }



    async update(
        id:string,
        data:Partial<Invoice>
    ){

        const invoice =
            await this.findById(id);


        if(!invoice)
            throw new Error(
                'Invoice not found'
            );


        Object.assign(
            invoice,
            data,
            {
                updatedAt:
                    new Date().toISOString()
            }
        );


        return invoice;

    }



    async archive(
        id:string
    ){

        return this.update(
            id,
            {
                archived:true
            }
        );

    }



    async restore(
        id:string
    ){

        return this.update(
            id,
            {
                archived:false
            }
        );

    }


}


export const InvoicesRepositoryInstance =
    new InvoicesRepository();