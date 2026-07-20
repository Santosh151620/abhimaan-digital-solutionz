import type {
    Invoice,
    InvoiceStatus,
} from '@/types/crm/Invoices';


class InvoicesRepository {

    private invoices =
        new Map<string, Invoice>();


    list(): Invoice[] {

        return [
            ...this.invoices.values()
        ]
        .filter(
            (invoice) =>
                !invoice.archived
        );

    }


    listArchived(): Invoice[] {

        return [
            ...this.invoices.values()
        ]
        .filter(
            (invoice) =>
                invoice.archived
        );

    }


    details(
        id: string
    ): Invoice | null {

        return (
            this.invoices.get(id)
            ??
            null
        );

    }


    create(
        data: Partial<Invoice>
    ): Invoice {

        const now =
            new Date().toISOString().substring(0,10)


        const invoice: Invoice = {

            id:
                crypto.randomUUID(),


            invoiceNumber:
                data.invoiceNumber ??
                `INV-${Date.now()}`,


            companyId:
                data.companyId ??
                '',


            customerName:
                data.customerName ??
                '',


            contractId:
                data.contractId,


            quotationId:
                data.quotationId,


            status:
                data.status ??
                'Draft',


            issueDate:
                data.issueDate ??
                now.substring(0,10),


            dueDate:
                data.dueDate ??
                now.substring(0,10),


            subtotal:
                data.subtotal ??
                0,


            tax:
                data.tax ??
                0,


            total:
                data.total ??
                0,


            currency:
                data.currency ??
                'INR',


            title:
                data.title,


            amount:
                data.amount,


            paidAmount:
                data.paidAmount ??
                0,


            balanceAmount:
                data.balanceAmount ??
                data.total ??
                0,


            notes:
                data.notes,


            archived:false,


            createdAt:
                now,


            updatedAt:
                now,

        };


        this.invoices.set(
            invoice.id,
            invoice
        );


        return invoice;

    }



    update(
        id:string,
        data:Partial<Invoice>
    ): Invoice | null {


        const existing =
            this.invoices.get(id);


        if(!existing){
            return null;
        }


        const updated = {

            ...existing,

            ...data,

            updatedAt:
                new Date()
                .toISOString(),

        };


        this.invoices.set(
            id,
            updated
        );


        return updated;

    }



    updateStatus(
        id:string,
        status:InvoiceStatus
    ){

        return this.update(
            id,
            {
                status
            }
        );

    }



    delete(
        id:string
    ){

        return this.update(
            id,
            {
                archived:true
            }
        );

    }



    restore(
        id:string
    ){

        return this.update(
            id,
            {
                archived:false
            }
        );

    }



    summary(){

        const invoices =
            this.list();


        return {

            total:
                invoices.length,


            draft:
                invoices.filter(
                    i =>
                    i.status === 'Draft'
                ).length,


            sent:
                invoices.filter(
                    i =>
                    i.status === 'Sent'
                ).length,


            paid:
                invoices.filter(
                    i =>
                    i.status === 'Paid'
                ).length,


            overdue:
                invoices.filter(
                    i =>
                    i.status === 'Overdue'
                ).length,


            cancelled:
                invoices.filter(
                    i =>
                    i.status === 'Cancelled'
                ).length,


            totalValue:
                invoices.reduce(
                    (
                        sum,
                        invoice
                    ) =>
                        sum +
                        invoice.total,
                    0
                ),


            outstandingValue:
                invoices.reduce(
                    (
                        sum,
                        invoice
                    ) =>
                        sum +
                        (
                            invoice.total -
                            (
                                invoice.paidAmount ??
                                0
                            )
                        ),
                    0
                ),

        };

    }


}


export const InvoicesRepositoryInstance =
    new InvoicesRepository();