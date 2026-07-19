import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
    getAsset,
} from '../actions';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function AssetDetailsPage({
    params,
}: Props) {

    const { id } =
        await params;

    const asset =
        await getAsset(id);

    if (!asset) {
        notFound();
    }

    return (

        <div className="">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        {asset.name}
                    </h1>

                    <p className="text-muted-foreground">
                        {asset.assetCode}
                    </p>

                </div>

                <Link
                    href={`/crm/assets/${asset.id}/edit`}
                    className="rounded-lg border px-4 py-2"
                >
                    Edit
                </Link>

            </div>

            <div className="grid gap-4 rounded-xl border bg-card p-6 md:grid-cols-2">

                <div>
                    <div className="text-sm text-muted-foreground">
                        Category
                    </div>
                    <div className="font-medium">
                        {asset.category}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">
                        Status
                    </div>
                    <div className="font-medium">
                        {asset.status}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">
                        Assigned To
                    </div>
                    <div className="font-medium">
                        {asset.assignedTo || '-'}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">
                        Location
                    </div>
                    <div className="font-medium">
                        {asset.location || '-'}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">
                        Purchase Date
                    </div>
                    <div className="font-medium">
                        {asset.purchaseDate}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">
                        Purchase Cost
                    </div>
                    <div className="font-medium">
                        {asset.purchaseCost.toLocaleString()}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">
                        Current Value
                    </div>
                    <div className="font-medium">
                        {asset.currentValue.toLocaleString()}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">
                        Created
                    </div>
                    <div className="font-medium">
                        {asset.createdAt}
                    </div>
                </div>

            </div>

            {asset.notes && (

                <div className="rounded-xl border bg-card p-6">

                    <h2 className="mb-2 font-semibold">
                        Notes
                    </h2>

                    <p className="whitespace-pre-wrap">
                        {asset.notes}
                    </p>

                </div>

            )}

        </div>

    );

}