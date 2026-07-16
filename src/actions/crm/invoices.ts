'use server';

export interface SaveInvoiceInput {
    invoiceNumber: string;
    customerName: string;
    companyId?: string;
    status: string;
    amount: string;
    dueDate?: string;
}

export async function saveInvoice(
    formData: FormData
) {

    const invoice: SaveInvoiceInput = {

        invoiceNumber: String(
            formData.get('invoiceNumber') ?? ''
        ),

        customerName: String(
            formData.get('customerName') ?? ''
        ),

        companyId: String(
            formData.get('companyId') ?? ''
        ),

        status: String(
            formData.get('status') ?? 'Draft'
        ),

        amount: String(
            formData.get('amount') ?? '0'
        ),

        dueDate: String(
            formData.get('dueDate') ?? ''
        ),

    };


    /*
        Production persistence hook.

        Supabase integration,
        tenant isolation,
        RBAC validation,
        accounting workflow,
        audit trail

        will connect here
        using existing project patterns.
    */


    return {
        success: true,
        data: invoice,
    };

}