import AssetsForm from '@/components/crm/assets/AssetsForm';
import AssetsSummary from '@/components/crm/assets/AssetsSummary';
import AssetsTable from '@/components/crm/assets/AssetsTable';
import type { Asset } from '@/types/crm/Assets';

const assets: Asset[] = [];

async function saveAsset(formData: FormData) {
    'use server';

    const assetNumber = String(
        formData.get('assetNumber') ?? ''
    );

    const name = String(
        formData.get('name') ?? ''
    );

    const customerName = String(
        formData.get('customerName') ?? ''
    );

    const companyId = String(
        formData.get('companyId') ?? ''
    );

    const category = String(
        formData.get('category') ?? ''
    );

    const status = String(
        formData.get('status') ?? 'Active'
    );

    const purchaseDate = String(
        formData.get('purchaseDate') ?? ''
    );

    const description = String(
        formData.get('description') ?? ''
    );

    console.log({
        assetNumber,
        name,
        customerName,
        companyId,
        category,
        status,
        purchaseDate,
        description,
    });
}

export default async function AssetsPage() {

    return (

        <div className="space-y-8 p-6">

            <div>

                <h1 className="text-3xl font-bold">
                    Assets
                </h1>

                <p className="text-muted-foreground">
                    Manage customer assets and lifecycle tracking.
                </p>

            </div>


            <AssetsSummary
                assets={assets}
            />


            <AssetsForm
                action={saveAsset}
            />


            <AssetsTable
                assets={assets}
            />

        </div>

    );

}