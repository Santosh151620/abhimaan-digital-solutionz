import { redirect } from 'next/navigation';
import type { Asset } from '@/types/crm/Assets';

import AssetsForm from '@/components/crm/assets/AssetsForm';

import {
    createAsset,
} from '../actions';

export default function NewAssetPage() {

    async function submit(
        formData: FormData
    ) {
        'use server';

        const asset =
            await createAsset({

                assetCode: String(
                    formData.get('assetCode') ?? ''
                ),

                name: String(
                    formData.get('name') ?? ''
                ),

                category: String(
                    formData.get('category') ?? ''
                ) as Asset['category'],

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
                    ?? 'Active',

                notes: String(
                    formData.get('notes') ?? ''
                ),

            });

        redirect(
            `/crm/assets/${asset.id}`
        );

    }

    return (

        <div className="">

            <h1 className="text-2xl font-bold">
                New Asset
            </h1>

            <AssetsForm
                action={submit}
            />

        </div>

    );

}