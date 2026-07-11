"use client";

import { use } from "react";
import { useRouter } from "next/navigation";

import { CompaniesForm } from "@/components/crm/companies";
import { CompaniesServiceInstance } from "@/services/crm/CompaniesService";

import type { CompanyDetails } from "@/types/crm/Companies";

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
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Edit Company
        </h1>

        <p className="text-muted-foreground">
          Update company information
        </p>
      </div>

      <CompaniesForm
        onSubmit={handleSubmit}
      />
    </main>
  );
}