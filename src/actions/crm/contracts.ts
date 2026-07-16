'use server';

export interface SaveContractInput {
    contractNumber: string;
    title: string;
    customerName: string;
    companyId?: string;
    status: string;
    startDate?: string;
    endDate?: string;
    description?: string;
}

export async function saveContract(
    formData: FormData
) {

    const contract: SaveContractInput = {

        contractNumber: String(
            formData.get('contractNumber') ?? ''
        ),

        title: String(
            formData.get('title') ?? ''
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

        startDate: String(
            formData.get('startDate') ?? ''
        ),

        endDate: String(
            formData.get('endDate') ?? ''
        ),

        description: String(
            formData.get('description') ?? ''
        ),

    };


    /*
        Production persistence hook.

        Supabase integration,
        tenant isolation,
        RBAC validation,
        contract lifecycle rules,
        audit logging

        will connect here
        using existing architecture.
    */


    return {
        success: true,
        data: contract,
    };

}