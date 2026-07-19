import {
    notFound,
    redirect,
} from 'next/navigation';

import type {
    ContractStatus,
} from '@/types/crm/Contracts';

import ContractsForm from '@/components/crm/contracts/ContractsForm';

import {
    getContract,
    updateContract,
} from '../../actions';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditContractPage({
    params,
}: Props) {

    const { id } = await params;

    const contract =
        await getContract(id);

    if (!contract) {
        notFound();
    }

    async function submit(
        formData: FormData
    ) {
        'use server';

        await updateContract(
            id,
            {

                title: String(
                    formData.get('title') ?? ''
                ),

                contractNumber: String(
                    formData.get('contractNumber') ?? ''
                ),

                customerName: String(
                    formData.get('customerName') ?? ''
                ),

                companyId: String(
                    formData.get('companyId') ?? ''
                ),

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

                status: String(
                    formData.get('status') ?? contract?.status
                ) as ContractStatus,

                notes: String(
                    formData.get('notes') ?? ''
                ),

            }
        );

        redirect(
            `/crm/contracts/${id}`
        );

    }

    return (

        <div>

            <h1 className="text-2xl font-bold">
                Edit Contract
            </h1>

            <ContractsForm
                initialData={contract}
                action={submit}
            />

        </div>

    );

}