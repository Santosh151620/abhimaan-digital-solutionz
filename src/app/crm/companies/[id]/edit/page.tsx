'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { CompaniesForm } from '@/components/crm/companies';
import { CompaniesServiceInstance } from '@/services/crm/CompaniesService';
import type { Company } from '@/types/crm/Companies';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function EditCompaniesPage({
    params,
}: PageProps) {
    const { id } = use(params);

    const router = useRouter();

    const [company, setCompany] =
        useState<Partial<Company>>();

    useEffect(() => {
        async function load() {
            const data =
                await CompaniesServiceInstance.details(id);

            if (data) {
                setCompany(data);
            }
        }

        load();
    }, [id]);

    async function handleSubmit(values: Partial<Company>) {
        await CompaniesServiceInstance.update(
            id,
            values
        );

        router.push(`/crm/companies/${id}`);
    }

    if (!company) {
        return (
            <div className="p-6">
                Loading company...
            </div>
        );
    }

    return (
        <CompaniesForm
            initialValues={company}
            onSubmit={handleSubmit}
            onCancel={() =>
                router.push(`/crm/companies/${id}`)
            }
        />
    );
}