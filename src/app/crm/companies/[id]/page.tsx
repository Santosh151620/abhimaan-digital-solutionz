import Link from "next/link";
import { notFound } from "next/navigation";
import CRMPageLayout from "@/components/crm/shared/layout/CRMPageLayout";
import EntityOverviewGrid from "@/components/entities/EntityOverviewGrid";
import EntityWorkspace from "@/components/entities/EntityWorkspace";
import { CompaniesServiceInstance } from "@/services/crm/CompaniesService";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CompanyDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const company = await CompaniesServiceInstance.details(id);

  if (!company) {
    notFound();
  }

  return (
    <CRMPageLayout>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {company.name}
          </h1>

          <p className="text-muted-foreground">
            Company Details
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/crm/companies"
            className="rounded-lg border px-4 py-2 hover:bg-muted"
          >
            Back
          </Link>

          <Link
            href={`/crm/companies/${company.id}/edit`}
            className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground"
          >
            Edit
          </Link>
        </div>
      </div>

      <EntityWorkspace
        entityType="Company"
        entityId={company.id}
        overview={
          <EntityOverviewGrid
            items={[
              {
                title: "Status",
                value: company.status,
              },
              {
                title: "Industry",
                value: company.industry ?? "—",
              },
              {
                title: "Employees",
                value: company.employees ?? "—",
              },
              {
                title: "Website",
                value: company.website ?? "—",
              },
              {
                title: "Email",
                value: company.email ?? "—",
              },
              {
                title: "Phone",
                value: company.phone ?? "—",
              },
              {
                title: "Legal Name",
                value: company.legalName ?? "—",
              },
              {
                title: "Address",
                value: company.address ?? "—",
              },
            ]}
          />
        }
      />
    </CRMPageLayout>
  );
}