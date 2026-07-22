import {
  notFound,
  redirect,
} from 'next/navigation';

import CRMPageLayout from '@/components/crm/shared/layout/CRMPageLayout';

import CRMHeader from '@/components/crm/shared/layout/CRMHeader';

import {
  CompaniesForm,
} from '@/components/crm/companies';

import {
  getCompany,
  updateCompany,
} from '../../actions';

import type {
  CompanyDetails,
} from '@/types/crm/Companies';


interface PageProps {
  params: Promise<{
    id: string;
  }>;
}


export default async function EditCompanyPage({
  params,
}: PageProps) {

  const {
    id,
  } = await params;


  const company = await getCompany(id);


  if (!company) {
    notFound();
  }


  async function submit(
    values: Partial<CompanyDetails>
  ) {
    'use server';


    await updateCompany(
      id,
      values
    );


    redirect(
      `/crm/companies/${id}`
    );
  }


  return (

    <CRMPageLayout>

      <CRMHeader
        title="Edit Company"
        description="Update company information and subscription details."
      />


      <CompaniesForm
        initialValues={company}
        onSubmit={submit}
      />

    </CRMPageLayout>

  );
}