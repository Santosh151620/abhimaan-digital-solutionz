import ContractsForm from '@/components/crm/contracts/ContractsForm';
import ContractsSummary from '@/components/crm/contracts/ContractsSummary';
import ContractsTable from '@/components/crm/contracts/ContractsTable';
import type { Contract } from '@/types/crm/Contracts';

const contracts: Contract[] = [];

async function saveContract(formData: FormData) {
    'use server';

    const contractNumber = String(
        formData.get('contractNumber') ?? ''
    );

    const title = String(
        formData.get('title') ?? ''
    );

    const customerName = String(
        formData.get('customerName') ?? ''
    );

    const companyId = String(
        formData.get('companyId') ?? ''
    );

    const status = String(
        formData.get('status') ?? 'Draft'
    );

    const startDate = String(
        formData.get('startDate') ?? ''
    );

    const endDate = String(
        formData.get('endDate') ?? ''
    );

    const description = String(
        formData.get('description') ?? ''
    );

    console.log({
        contractNumber,
        title,
        customerName,
        companyId,
        status,
        startDate,
        endDate,
        description,
    });
}

export default async function ContractsPage() {

    return (

        <div className="space-y-8 p-6">

            <div>

                <h1 className="text-3xl font-bold">
                    Contracts
                </h1>

                <p className="text-muted-foreground">
                    Manage customer contracts and agreements.
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