'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';

import { CompaniesForm } from '@/components/crm/companies';
import { CompaniesServiceInstance } from '@/services/crm/CompaniesService';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditCompaniesPage({
    params,
}: PageProps) {
    const router = useRouter();
    const { id } = use(params);

    async function handleSubmit(values: unknown) {
        await CompaniesServiceInstance.update(id, values);

        router.push(`/crm/companies/${id}`);
    }

    return (
        <CompaniesForm
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/crm/companies/${id}`)}
        />
    );
}