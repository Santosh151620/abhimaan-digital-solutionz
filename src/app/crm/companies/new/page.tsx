'use client';
import CRMPageLayout from "@/components/crm/shared/layout/CRMPageLayout";
import { useRouter } from 'next/navigation';

import PageHeader from '@/components/crm/ui/PageHeader';

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
    router.refresh();
  }

  return (
    <CRMPageLayout>
      <PageHeader
        title="New Company"
        description="Register a new customer organization in the CRM."
      />

      <CompaniesForm
        onSubmit={handleSubmit}
        onCancel={() => router.push('/crm/companies')}
      />
    </CRMPageLayout>
  );
}