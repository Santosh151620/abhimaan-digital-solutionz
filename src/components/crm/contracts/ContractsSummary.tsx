'use client';

import type { Contract } from '@/types/crm/Contracts';

interface Props {
    contracts: Contract[];
}

export default function ContractsSummary({
    contracts,
}: Props) {

    const totalContracts = contracts.length;

    const activeContracts = contracts.filter(
        (contract) => contract.status === 'Active'
    ).length;

    const pendingContracts = contracts.filter(
        (contract) => contract.status === 'Pending'
    ).length;

    const expiredContracts = contracts.filter(
        (contract) => contract.status === 'Expired'
    ).length;

    const totalValue = contracts.reduce(
        (sum, contract) => sum + contract.value,
        0
    );

    return (

        <div className="grid gap-4 md:grid-cols-5">

            <div className="rounded-xl border bg-card p-5">
                <div className="text-sm text-muted-foreground">
                    Total Contracts
                </div>

                <div className="mt-2 text-3xl font-bold">
                    {totalContracts}
                </div>
            </div>

            <div className="rounded-xl border bg-card p-5">
                <div className="text-sm text-muted-foreground">
                    Active
                </div>

                <div className="mt-2 text-3xl font-bold text-green-600">
                    {activeContracts}
                </div>
            </div>

            <div className="rounded-xl border bg-card p-5">
                <div className="text-sm text-muted-foreground">
                    Pending
                </div>

                <div className="mt-2 text-3xl font-bold text-yellow-600">
                    {pendingContracts}
                </div>
            </div>

            <div className="rounded-xl border bg-card p-5">
                <div className="text-sm text-muted-foreground">
                    Expired
                </div>

                <div className="mt-2 text-3xl font-bold text-red-600">
                    {expiredContracts}
                </div>
            </div>

            <div className="rounded-xl border bg-card p-5">
                <div className="text-sm text-muted-foreground">
                    Total Value
                </div>

                <div className="mt-2 text-3xl font-bold">
                    {totalValue.toLocaleString('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                    })}
                </div>
            </div>

        </div>

    );

}