'use client';

import Link from 'next/link';
import type { ContractStatus } from '@/types/crm/Contracts';
import type { Contract } from '@/types/crm/Contracts';

interface Props {
    contracts: Contract[];
}

export default function ContractsTable({
    contracts,
}: Props) {

    if (contracts.length === 0) {
        return (
            <div className="rounded-xl border bg-card p-10 text-center text-muted-foreground">
                No contracts found.
            </div>
        );
    }

    const badgeClasses: Partial<
    Record<ContractStatus, string>
> = {

    Draft:
        'bg-gray-100 text-gray-700',

    Pending:
        'bg-yellow-100 text-yellow-700',

    Active:
        'bg-green-100 text-green-700',

    Completed:
        'bg-blue-100 text-blue-700',

    Expired:
        'bg-red-100 text-red-700',

    Terminated:
        'bg-red-100 text-red-700',

    Cancelled:
        'bg-gray-100 text-gray-700',

};
    return (

        <div className="overflow-x-auto rounded-xl border bg-card">

            <table className="min-w-full">

                <thead className="bg-muted/40">

                    <tr>

                        <th className="px-4 py-3 text-left">
                            Contract
                        </th>

                        <th className="px-4 py-3 text-left">
                            Customer
                        </th>

                        <th className="px-4 py-3 text-left">
                            Period
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

                    {contracts.map((contract) => (

                        <tr
                            key={contract.id}
                            className="border-t hover:bg-muted/20"
                        >

                            <td className="px-4 py-3">

                                <div className="font-medium">
                                    {contract.title}
                                </div>

                                <div className="text-xs text-muted-foreground">
                                    {contract.contractNumber}
                                </div>

                            </td>

                            <td className="px-4 py-3">
                                {contract.customerName}
                            </td>

                            <td className="px-4 py-3">
                                {contract.startDate}
                                {' - '}
                                {contract.endDate}
                            </td>

                            <td className="px-4 py-3">
                                {contract.currency}{' '}
                                {contract.value.toLocaleString()}
                            </td>

                            <td className="px-4 py-3">

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${badgeClasses[contract.status]}`}
                                >
                                    {contract.status}
                                </span>

                            </td>

                            <td className="px-4 py-3">

                                <div className="flex gap-2">

                                    <Link
                                        href={`/crm/contracts/${contract.id}`}
                                        className="rounded border px-3 py-1 text-sm hover:bg-muted"
                                    >
                                        View
                                    </Link>

                                    <Link
                                        href={`/crm/contracts/${contract.id}/edit`}
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