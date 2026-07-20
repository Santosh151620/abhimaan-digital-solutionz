import {
    redirect,
} from 'next/navigation';

import InvoicesForm from '@/components/crm/invoices/InvoicesForm';

import {
    createInvoice,
} from '../actions';

import type {
    InvoiceStatus,
} from '@/types/crm/Invoices';

export default function NewInvoicePage() {

    async function submit(
        formData: FormData,
    ) {

        'use server';

        await createInvoice({

            invoiceNumber:
                String(
                    formData.get('invoiceNumber') ?? '',
                ),

            title:
                String(
                    formData.get('title') ?? '',
                ),

            customerName:
                String(
                    formData.get('customerName') ?? '',
                ),

            companyId:
                String(
                    formData.get('companyId') ?? '',
                ),

            issueDate:
                String(
                    formData.get('issueDate') ?? '',
                ),

            dueDate:
                String(
                    formData.get('dueDate') ?? '',
                ),

            total:
                Number(
                    formData.get('total') ?? 0,
                ),

            balanceAmount:
                Number(
                    formData.get('total') ?? 0,
                ),

            currency:
                String(
                    formData.get('currency') ?? 'INR',
                ),

            status:
                String(
                    formData.get('status') ?? 'Draft',
                ) as InvoiceStatus,

            notes:
                String(
                    formData.get('notes') ?? '',
                ),

        });

        redirect(
            '/crm/invoices',
        );

    }

    return (

        <div className="space-y-6 p-6">

            <h1 className="text-2xl font-bold">
                New Invoice
            </h1>

            <InvoicesForm
                action={submit}
            />

        </div>

    );

}