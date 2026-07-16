'use server';

export interface SaveTicketInput {
    ticketNumber: string;
    subject: string;
    customerName: string;
    companyId?: string;
    status: string;
    priority: string;
    description?: string;
}

export async function saveTicket(
    formData: FormData
) {

    const ticket: SaveTicketInput = {
        ticketNumber: String(
            formData.get('ticketNumber') ?? ''
        ),

        subject: String(
            formData.get('subject') ?? ''
        ),

        customerName: String(
            formData.get('customerName') ?? ''
        ),

        companyId: String(
            formData.get('companyId') ?? ''
        ),

        status: String(
            formData.get('status') ?? 'Open'
        ),

        priority: String(
            formData.get('priority') ?? 'Medium'
        ),

        description: String(
            formData.get('description') ?? ''
        ),
    };


    /*
        Production persistence hook.

        Supabase integration,
        tenant isolation,
        RBAC checks,
        validation,
        audit logging

        will be connected here
        using the existing project patterns.
    */


    return {
        success: true,
        data: ticket,
    };

}