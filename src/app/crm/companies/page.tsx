import PageHeader from '@/components/crm/ui/PageHeader';
import CRMPageLayout from "@/components/crm/shared/layout/CRMPageLayout";
import { CompaniesServiceInstance } from '@/services/crm/CompaniesService';
import {
  CompaniesDataTable,
  CompaniesSummaryCards,
} from '@/components/crm/companies';

export default async function CompaniesPage() {
  const companies = await CompaniesServiceInstance.list();

  const total = companies.length;

  const active = companies.filter(
    (company) => company.status === 'ACTIVE'
  ).length;

  const prospect = companies.filter(
    (company) => company.status === 'PROSPECT'
  ).length;

  const inactive = companies.filter(
    (company) => company.status === 'INACTIVE'
  ).length;

  return (
    <CRMPageLayout>
      <PageHeader
        title="Companies"
        description="Manage customers, organizations and subscription lifecycle."
      />

      <section className="grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl border border-cyan-500/20 bg-white/80 p-6 shadow-sm backdrop-blur">
          <p className="text-sm text-slate-500">
            Total Companies
          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            {total}
          </h2>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-white/80 p-6 shadow-sm backdrop-blur">
          <p className="text-sm text-slate-500">
            Active
          </p>

          <h2 className="mt-3 text-4xl font-bold text-emerald-600">
            {active}
          </h2>
        </div>

        <div className="rounded-2xl border border-blue-500/20 bg-white/80 p-6 shadow-sm backdrop-blur">
          <p className="text-sm text-slate-500">
            Prospects
          </p>

          <h2 className="mt-3 text-4xl font-bold text-blue-600">
            {prospect}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-500/20 bg-white/80 p-6 shadow-sm backdrop-blur">
          <p className="text-sm text-slate-500">
            Inactive
          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-600">
            {inactive}
          </h2>
        </div>
      </section>

      <CompaniesSummaryCards />

      <CompaniesDataTable />
    </CRMPageLayout>
  );
}