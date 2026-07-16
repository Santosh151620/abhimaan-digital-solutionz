'use client';

import Link from 'next/link';

import type { Asset } from '@/types/crm/Assets';

interface Props {
    assets: Asset[];
}

export default function AssetsTable({
    assets,
}: Props) {

    if (assets.length === 0) {
        return (
            <div className="rounded-xl border bg-white p-12 text-center text-muted-foreground">
                No assets found.
            </div>
        );
    }

    const badge: Record<Asset['status'], string> = {
        Available:
            'bg-green-100 text-green-700',
        Allocated:
            'bg-blue-100 text-blue-700',
        Maintenance:
            'bg-yellow-100 text-yellow-700',
        Retired:
            'bg-gray-100 text-gray-700',
    };

    return (

        <div className="overflow-x-auto rounded-xl border bg-white">

            <table className="min-w-full">

                <thead className="bg-muted/40">

                    <tr>

                        <th className="px-4 py-3 text-left">
                            Asset
                        </th>

                        <th className="px-4 py-3 text-left">
                            Category
                        </th>

                        <th className="px-4 py-3 text-left">
                            Serial No.
                        </th>

                        <th className="px-4 py-3 text-left">
                            Assigned To
                        </th>

                        <th className="px-4 py-3 text-left">
                            Value
                        </th>

                        <th className="px-4 py-3 text-left">
                            Status
                        </th>

                        <th className="px-4 py-3 text-left">
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {assets.map((asset) => (

                        <tr
                            key={asset.id}
                            className="border-t"
                        >

                            <td className="px-4 py-3 font-medium">
                                {asset.name}
                            </td>

                            <td className="px-4 py-3">
                                {asset.category}
                            </td>

                            <td className="px-4 py-3">
                                {asset.serialNumber}
                            </td>

                            <td className="px-4 py-3">
                                {asset.assignedTo ?? '-'}
                            </td>

                            <td className="px-4 py-3">
                                ₹
                                {(
                                    asset.currentValue ??
                                    asset.purchaseValue
                                ).toLocaleString()}
                            </td>

                            <td className="px-4 py-3">

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${badge[asset.status]}`}
                                >
                                    {asset.status}
                                </span>

                            </td>

                            <td className="px-4 py-3">

                                <div className="flex gap-2">

                                    <Link
                                        href={`/crm/assets/${asset.id}`}
                                        className="rounded border px-3 py-1 text-sm hover:bg-muted"
                                    >
                                        View
                                    </Link>

                                    <Link
                                        href={`/crm/assets/${asset.id}/edit`}
                                        className="rounded border px-3 py-1 text-sm hover:bg-muted"
                                    >
                                        Edit
                                    </Link>

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}