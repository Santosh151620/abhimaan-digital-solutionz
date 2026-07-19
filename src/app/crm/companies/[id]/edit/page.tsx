'use client';
import CRMPageLayout from "@/components/crm/shared/layout/CRMPageLayout";
import { use } from 'react';
import { useRouter } from 'next/navigation';

import PageHeader from '@/components/crm/ui/PageHeader';

import { CompaniesForm } from '@/components/crm/companies';
import { CompaniesServiceInstance } from '@/services/crm/CompaniesService';

import type { CompanyDetails } from '@/types/crm/Companies';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditCompanyPage({
  params,
}: PageProps) {
  const { id } = use(params);

  const router = useRouter();

  async function handleSubmit(
    values: Partial<CompanyDetails>
  ) {
    await CompaniesServiceInstance.update(
      id,
      values
    );

    router.push(`/crm/companies/${id}`);
    router.refresh();
  }

  return (
    <CRMPageLayout>
      <PageHeader
        title="Edit Company"
        description="Update company information and subscription details."
      />

      <CompaniesForm
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/crm/companies/${id}`)}
      />
    </CRMPageLayout>
  );
}