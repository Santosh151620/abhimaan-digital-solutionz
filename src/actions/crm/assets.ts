'use server';

export interface SaveAssetInput {
    assetNumber: string;
    name: string;
    customerName: string;
    companyId?: string;
    category?: string;
    status: string;
    purchaseDate?: string;
    description?: string;
}

export async function saveAsset(
    formData: FormData
) {

    const asset: SaveAssetInput = {

        assetNumber: String(
            formData.get('assetNumber') ?? ''
        ),

        name: String(
            formData.get('name') ?? ''
        ),

        customerName: String(
            formData.get('customerName') ?? ''
        ),

        companyId: String(
            formData.get('companyId') ?? ''
        ),

        category: String(
            formData.get('category') ?? ''
        ),

        status: String(
            formData.get('status') ?? 'Active'
        ),

        purchaseDate: String(
            formData.get('purchaseDate') ?? ''
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
        asset lifecycle rules,
        audit logging

        will connect here
        using existing architecture.
    */


    return {
        success: true,
        data: asset,
    };

}