import type {
    Quotation,
    QuotationStatus,
} from '@/types/crm/Quotations';


class QuotationsRepository {


    private quotations =
        new Map<string, Quotation>();


    async list(): Promise<Quotation[]> {

        return [
            ...this.quotations.values(),
        ]
        .filter(
            quotation =>
                !quotation.archived
        )
        .sort(
            (a,b)=>
                b.createdAt.localeCompare(
                    a.createdAt
                )
        );

    }



    async listArchived(): Promise<Quotation[]> {

        return [
            ...this.quotations.values(),
        ]
        .filter(
            quotation =>
                quotation.archived
        );

    }



    async findById(
        id:string
    ):Promise<Quotation | null>{

        return (
            this.quotations.get(id)
            ??
            null
        );

    }



    async details(
        id:string
    ):Promise<Quotation | null>{

        return this.findById(id);

    }



    async create(
        data:Partial<Quotation>
    ):Promise<Quotation>{


        const now =
            new Date()
            .toISOString();


        const items =
            data.items ?? [];



        const subtotal =
            data.subtotal ??
            items.reduce(
                (
                    sum,
                    item
                ) =>
                    sum +
                    (
                        item.quantity *
                        item.unitPrice
                    ),
                0
            );



        const tax =
            data.tax ?? 0;


        const discount =
            data.discount ?? 0;



        const quotation:Quotation = {


            id:
                crypto.randomUUID(),



            quotationNumber:
                data.quotationNumber ??
                `QT-${Date.now()}`,



            companyId:
                data.companyId ??
                '',



            opportunityId:
                data.opportunityId,



            title:
                data.title ??
                '',



            customerName:
                data.customerName ??
                '',



            amount:
                data.amount ??
                0,



            status:
                data.status ??
                'Draft',



            issueDate:
                data.issueDate ??
                now.substring(0,10),



            validUntil:
                data.validUntil ??
                now.substring(0,10),



            subtotal,


            tax,


            discount,



            total:
                data.total ??
                (
                    subtotal +
                    tax -
                    discount
                ),



            currency:
                data.currency ??
                'INR',



            notes:
                data.notes,



            items,



            archived:false,



            createdAt:
                now,



            updatedAt:
                now,

        };



        this.quotations.set(
            quotation.id,
            quotation
        );


        return quotation;

    }




    async update(
        id:string,
        data:Partial<Quotation>
    ):Promise<Quotation | null>{


        const existing =
            await this.findById(id);



        if(!existing){

            return null;

        }



        const updated:Quotation = {

            ...existing,

            ...data,


            updatedAt:
                new Date()
                .toISOString(),

        };



        this.quotations.set(
            id,
            updated
        );



        return updated;

    }




    async updateStatus(
        id:string,
        status:QuotationStatus
    ){

        return this.update(
            id,
            {
                status
            }
        );

    }





    async delete(
        id:string
    ):Promise<boolean>{


        const quotation =
            this.quotations.get(id);



        if(!quotation){

            return false;

        }



        quotation.archived=true;


        quotation.updatedAt =
            new Date()
            .toISOString();



        return true;

    }




    async restore(
        id:string
    ):Promise<boolean>{


        const quotation =
            this.quotations.get(id);



        if(!quotation){

            return false;

        }



        quotation.archived=false;


        quotation.updatedAt =
            new Date()
            .toISOString();



        return true;

    }




    async search(
        filters?:{
            status?:QuotationStatus;
            search?:string;
        }
    ):Promise<Quotation[]>{


        let quotations =
            await this.list();



        if(filters?.status){

            quotations =
                quotations.filter(
                    q =>
                        q.status ===
                        filters.status
                );

        }



        if(filters?.search){

            const keyword =
                filters.search.toLowerCase();


            quotations =
                quotations.filter(
                    q =>
                        q.title
                        .toLowerCase()
                        .includes(keyword)
                        ||

                        q.customerName
                        .toLowerCase()
                        .includes(keyword)
                        ||

                        q.quotationNumber
                        .toLowerCase()
                        .includes(keyword)

                );

        }



        return quotations;

    }




    async summary(){


        const quotations =
            await this.list();



        return {

            total:
                quotations.length,


            draft:
                quotations.filter(
                    q=>q.status==='Draft'
                ).length,


            sent:
                quotations.filter(
                    q=>q.status==='Sent'
                ).length,


            accepted:
                quotations.filter(
                    q=>q.status==='Accepted'
                ).length,


            rejected:
                quotations.filter(
                    q=>q.status==='Rejected'
                ).length,


            totalValue:
                quotations.reduce(
                    (
                        sum,
                        q
                    )=>
                        sum +
                        q.total,
                    0
                ),

        };

    }

}


export const QuotationsRepositoryInstance =
    new QuotationsRepository();