import Link from 'next/link';

import ContractsForm from '@/components/crm/contracts/ContractsForm';
import ContractsSummary from '@/components/crm/contracts/ContractsSummary';
import ContractsTable from '@/components/crm/contracts/ContractsTable';

import {
    createContract,
    getContracts,
} from './actions';

import type {
    ContractStatus,
} from '@/types/crm/Contracts';

async function saveContract(
    formData: FormData,
) {
    'use server';

    await createContract({

        contractNumber: String(
            formData.get('contractNumber') ?? '',
        ),

        title: String(
            formData.get('title') ?? '',
        ),

        customerName: String(
            formData.get('customerName') ?? '',
        ),

        companyId: String(
            formData.get('companyId') ?? '',
        ),

        status:
            String(
                formData.get('status') ?? 'Draft',
            ) as ContractStatus,

        startDate: String(
            formData.get('startDate') ?? '',
        ),

        endDate: String(
            formData.get('endDate') ?? '',
        ),

        value: Number(
            formData.get('value') ?? 0,
        ),

        currency: String(
            formData.get('currency') ?? 'INR',
        ),

        notes: String(
            formData.get('notes') ?? '',
        ),

    });

}

export default async function ContractsPage() {

    const contracts =
        await getContracts();

    return (

        <div className="space-y-8 p-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        Contracts
                    </h1>

                    <p className="text-muted-foreground">
                        Manage customer contracts and agreements.
                    </p>

                </div>

                <Link
                    href="/crm/contracts/new"
                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                >
                    + New Contract
                </Link>

            </div>

            <ContractsSummary
                contracts={contracts}
            />

            <ContractsForm
                action={saveContract}
            />

            <ContractsTable
                contracts={contracts}
            />

        </div>

    );

}