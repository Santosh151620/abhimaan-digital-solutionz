import { notFound, redirect } from 'next/navigation';

import AssetsForm from '@/components/crm/assets/AssetsForm';

import {
    getAsset,
    updateAsset,
} from '../../actions';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditAssetPage({
    params,
}: Props) {

    const { id } =
        await params;

    const asset =
        await getAsset(id);

    if (!asset) {
        notFound();
    }

    async function submit(
        formData: FormData
    ) {
        'use server';

        await updateAsset(
            id,
            {

                assetCode: String(
                    formData.get('assetCode') ?? ''
                ),

                name: String(
                    formData.get('name') ?? ''
                ),

                category: String(
                    formData.get('category') ?? ''
                ),

                assignedTo: String(
                    formData.get('assignedTo') ?? ''
                ),

                purchaseDate: String(
                    formData.get('purchaseDate') ?? ''
                ),

                purchaseCost: Number(
                    formData.get('purchaseCost') ?? 0
                ),

                currentValue: Number(
                    formData.get('currentValue') ?? 0
                ),

                location: String(
                    formData.get('location') ?? ''
                ),

                status:
                    (formData.get('status') as import('@/types/crm/Assets').AssetStatus)
                    ?? asset.status,

                notes: String(
                    formData.get('notes') ?? ''
                ),

            }
        );

        redirect(
            `/crm/assets/${id}`
        );

    }

    return (

        <div className="space-y-6">

            <h1 className="text-2xl font-bold">
                Edit Asset
            </h1>

            <AssetsForm
                initialData={asset}
                action={submit}
            />

        </div>

    );

}