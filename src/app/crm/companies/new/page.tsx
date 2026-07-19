import CRMPageLayout from '@/components/crm/shared/layout/CRMPageLayout';
import PageHeader from '@/components/crm/ui/PageHeader';

import {
    CompaniesForm,
} from '@/components/crm/companies';

import {
    createCompany,
} from '../actions';

import {
    redirect,
} from 'next/navigation';

import type {
    CompanyDetails,
} from '@/types/crm/Companies';


export default function NewCompaniesPage() {


    async function submit(
        values: Partial<CompanyDetails>
    ) {
        'use server';

        await createCompany(
            values
        );

        redirect(
            '/crm/companies'
        );
    }


    return (

        <CRMPageLayout>

            <PageHeader
                title="New Company"
                description="Register a new customer organization in the CRM."
            />

            <CompaniesForm
                onSubmit={submit}
            />

        </CRMPageLayout>

    );
}