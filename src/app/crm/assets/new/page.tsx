import { redirect } from 'next/navigation';

import CRMPageLayout from '@/components/crm/shared/layout/CRMPageLayout';
import PageHeader from '@/components/crm/ui/PageHeader';

import AssetsForm from '@/components/crm/assets/AssetsForm';

import {
    createAsset,
} from '../actions';

import type { Asset } from '@/types/crm/Assets';

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

                status: String(
                    formData.get('status') ?? 'Available'
                ) as Asset['status'],

                notes: String(
                    formData.get('notes') ?? ''
                ),

            });

        redirect(
            `/crm/assets/${asset.id}`
        );

    }

    return (

        <CRMPageLayout>

            <PageHeader
                title="New Asset"
                description="Create a new asset."
            />

            <AssetsForm
                action={submit}
            />

        </CRMPageLayout>

    );

}