import {
    revalidatePath,
} from 'next/cache';

import ContractsForm from '@/components/crm/contracts/ContractsForm';
import ContractsSummary from '@/components/crm/contracts/ContractsSummary';
import ContractsTable from '@/components/crm/contracts/ContractsTable';

import type {
    Contract,
} from '@/types/crm/Contracts';

import {
    createContract,
} from './actions';


const contracts: Contract[] = [];


async function saveContract(
    formData: FormData
) {
    'use server';

    await createContract({

        contractNumber: String(
            formData.get('contractNumber') ?? ''
        ),

        title: String(
            formData.get('title') ?? ''
        ),

        customerName: String(
            formData.get('customerName') ?? ''
        ),

        companyId: String(
            formData.get('companyId') ?? ''
        ),

        status: String(
            formData.get('status') ?? 'Draft'
        ) as Contract['status'],

        startDate: String(
            formData.get('startDate') ?? ''
        ),

        endDate: String(
            formData.get('endDate') ?? ''
        ),

        value: Number(
            formData.get('value') ?? 0
        ),
    });


    revalidatePath(
        '/crm/contracts'
    );
}


export default function ContractsPage() {

    return (

        <div className="space-y-8 p-6">

            <div>

                <h1 className="text-3xl font-bold">
                    Contracts
                </h1>

                <p className="text-muted-foreground">
                    Manage customer contracts.
                </p>

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