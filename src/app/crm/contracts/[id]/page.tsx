import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
    getContract,
} from '../actions';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function ContractDetailsPage({
    params,
}: Props) {

    const { id } =
        await params;

    const contract =
        await getContract(id);

    if (!contract) {
        notFound();
    }

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        {contract.title}
                    </h1>

                    <p className="text-muted-foreground">
                        {contract.contractNumber}
                    </p>

                </div>

                <Link
                    href={`/crm/contracts/${contract.id}/edit`}
                    className="rounded-lg border px-4 py-2"
                >
                    Edit
                </Link>

            </div>

            <div className="grid gap-4 rounded-xl border bg-card p-6 md:grid-cols-2">

                <div>
                    <div className="text-sm text-muted-foreground">
                        Customer
                    </div>
                    <div className="font-medium">
                        {contract.customerName}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">
                        Company
                    </div>
                    <div className="font-medium">
                        {contract.companyId}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">
                        Status
                    </div>
                    <div className="font-medium">
                        {contract.status}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">
                        Value
                    </div>
                    <div className="font-medium">
                        {contract.currency} {contract.value.toLocaleString()}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">
                        Start Date
                    </div>
                    <div className="font-medium">
                        {contract.startDate}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">
                        End Date
                    </div>
                    <div className="font-medium">
                        {contract.endDate}
                    </div>
                </div>

            </div>

            {contract.notes && (

                <div className="rounded-xl border bg-card p-6">

                    <h2 className="mb-2 font-semibold">
                        Notes
                    </h2>

                    <p className="whitespace-pre-wrap">
                        {contract.notes}
                    </p>

                </div>

            )}

        </div>

    );

}