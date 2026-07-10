'use client';

import { useRouter } from 'next/navigation';

import { CompaniesForm } from '@/components/crm/companies';
import { CompaniesServiceInstance } from '@/services/crm/CompaniesService';

export default function EditCompaniesPage() {
    const router = useRouter();

    async function handleSubmit(values: unknown) {
        // Repository update will be connected to the database later.
        await CompaniesServiceInstance.update('', values);

        router.push('/crm/companies');
    }

    return (
        <CompaniesForm
            onSubmit={handleSubmit}
            onCancel={() => router.push('/crm/companies')}
        />
    );
}