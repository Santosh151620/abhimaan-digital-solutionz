'use client';

import { useRouter } from 'next/navigation';

import { CompaniesForm } from '@/components/crm/companies';
import { CompaniesServiceInstance } from '@/services/crm/CompaniesService';

import type { CompanyDetails } from '@/types/crm/Companies';

export default function NewCompaniesPage() {

    const router = useRouter();

    async function handleSubmit(
        values: Partial<CompanyDetails>
    ) {

        await CompaniesServiceInstance.create(values);

        router.push('/crm/companies');

    }

    return (
        <CompaniesForm
            onSubmit={handleSubmit}
            onCancel={() => router.push('/crm/companies')}
        />
    );

}