'use client';

import { useRouter } from 'next/navigation';

import { CompaniesForm } from '@/components/crm/companies';
import { CompaniesServiceInstance } from '@/services/crm/CompaniesService';

export default function NewCompaniesPage() {
    const router = useRouter();

    async function handleSubmit(values: unknown) {
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