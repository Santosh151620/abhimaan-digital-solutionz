import { redirect } from 'next/navigation';

import CRMPageLayout from '@/components/crm/shared/layout/CRMPageLayout';

import CRMHeader from '@/components/crm/shared/layout/CRMHeader';

import {
    CompaniesForm,
} from '@/components/crm/companies';

import {
    createCompany,
} from '../actions';

import type {
    CompanyDetails,
} from '@/types/crm/Companies';

export default function NewCompaniesPage() {

    async function submit(
        values: Partial<CompanyDetails>,
    ) {
        'use server';

        await createCompany(values);

        redirect('/crm/companies');
    }

    return (

        <CRMPageLayout>

            <CRMHeader
                title="New Company"
                description="Register a new customer organization in the CRM."
            />

            <CompaniesForm
                onSubmit={submit}
            />

        </CRMPageLayout>

    );

}