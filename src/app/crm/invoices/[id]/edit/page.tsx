import {
    notFound,
    redirect,
} from 'next/navigation';


import InvoicesForm from '@/components/crm/invoices/InvoicesForm';


import {
    getInvoice,
    updateInvoice,
} from '../../actions';



interface Props {

    params: Promise<{
        id: string;
    }>;

}



export default async function EditInvoicePage({
    params,
}: Props) {


    const {
        id,
    } = await params;



    const invoice =
        await getInvoice(id);



    if (!invoice) {

        notFound();

    }



    async function submit(
        formData: FormData
    ) {

        'use server';



        await updateInvoice(
            id,
            {

                invoiceNumber:
                    String(
                        formData.get('invoiceNumber') ?? ''
                    ),


                title:
                    String(
                        formData.get('title') ?? ''
                    ),


                customerName:
                    String(
                        formData.get('customerName') ?? ''
                    ),


                companyId:
                    String(
                        formData.get('companyId') ?? ''
                    ),


                issueDate:
                    String(
                        formData.get('issueDate') ?? ''
                    ),


                dueDate:
                    String(
                        formData.get('dueDate') ?? ''
                    ),


                total:
                    Number(
                        formData.get('total') ?? 0
                    ),


                balanceAmount:
                    Number(
                        formData.get('total') ?? 0
                    ),


                currency:
                    String(
                        formData.get('currency') ?? 'INR'
                    ),


                status:
                    String(
                        formData.get('status') ?? invoice?.status
                    ) as any,


                notes:
                    String(
                        formData.get('notes') ?? ''
                    ),

            }
        );



        redirect(
            `/crm/invoices/${id}`
        );

    }



    return (

        <div className="space-y-6 p-6">


            <h1 className="text-2xl font-bold">
                Edit Invoice
            </h1>


            <InvoicesForm
                initialData={invoice}
                action={submit}
            />


        </div>

    );

}