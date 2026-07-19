import { redirect } from 'next/navigation';

import ContractsForm from '@/components/crm/contracts/ContractsForm';

import {
    createContract
} from '../actions';

import {
    revalidatePath
} from 'next/cache';

export default function NewContractPage() {

    async function submit(
        formData: FormData
    ) {
        'use server';

        const contract =
            await createContract({

                title: String(
                    formData.get('title') ?? ''
                ),

                customerName: String(
                    formData.get('customerName') ?? ''
                ),

                contractNumber: String(
                    formData.get('contractNumber') ?? ''
                ),

                status: String(
                    formData.get('status') ?? 'Draft'
                ) as import('@/types/crm/Contracts').ContractStatus,

                startDate: String(
                    formData.get('startDate') ?? ''
                ),

                endDate: String(
                    formData.get('endDate') ?? ''
                ),

                value: Number(
                    formData.get('value') ?? 0
                ),

                currency: String(
                    formData.get('currency') ?? 'INR'
                ),

                notes: String(
                    formData.get('notes') ?? ''
                ),

            });

        redirect(
            `/crm/contracts/${contract.id}`
        );

    }

    return (

        <div className="">

            <h1 className="text-2xl font-bold">
                New Contract
            </h1>

            <ContractsForm
                action={submit}
            />

        </div>

    );

}