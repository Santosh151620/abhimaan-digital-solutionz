import Link from "next/link";
 import type { Company } from "@/types/crm/Companies";
import { CompaniesServiceInstance } from "@/services/crm/CompaniesService";

export const dynamic = "force-dynamic";
export default async function DashboardPage() {

let companies: Company[] = [];

    try {

        companies = await CompaniesServiceInstance.list();

    } catch {

        companies = [];

    }

  const activeCompanies = companies.filter(
    (company: Company) => company.status === "ACTIVE"
).length;

const prospects = companies.filter(
    (company: Company) => company.status === "PROSPECT"
).length;

    return (

        <main className="space-y-8 p-8">

            <section>

                <h1 className="text-3xl font-bold">
                    CRM Dashboard
                </h1>

                <p className="text-muted-foreground">
                    Welcome back. Here&apos;s your business overview.
                </p>

            </section>

            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

                <DashboardCard
                    title="Companies"
                    value={companies.length}
                />

                <DashboardCard
                    title="Active Companies"
                    value={activeCompanies}
                />

                <DashboardCard
                    title="Prospects"
                    value={prospects}
                />

                <DashboardCard
                    title="Open Leads"
                    value="0"
                />

            </section>

            <section className="grid gap-6 xl:grid-cols-3">

                <div className="rounded-xl border bg-background p-6">

                    <div className="mb-5 flex items-center justify-between">

                        <h2 className="text-xl font-semibold">
                            Recent Companies
                        </h2>

                        <Link
                            href="/crm/companies"
                            className="text-primary hover:underline"
                        >
                            View All
                        </Link>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="min-w-full">

                            <thead>

                                <tr className="border-b">

                                    <th className="p-3 text-left">
                                        Company
                                    </th>

                                    <th className="p-3 text-left">
                                        Industry
                                    </th>

                                    <th className="p-3 text-left">
                                        Status
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {companies.slice(0, 5).map((company: Company) => (

                                    <tr
                                        key={company.id}
                                        className="border-b hover:bg-muted/20"
                                    >

                                        <td className="p-3">

                                            <Link
                                                href={`/crm/companies/${company.id}`}
                                                className="font-medium hover:text-primary"
                                            >
                                                {company.name}
                                            </Link>

                                        </td>

                                        <td className="p-3">
                                            {company.industry ?? "—"}
                                        </td>

                                        <td className="p-3">
                                            {company.status}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

                <div className="rounded-xl border bg-background p-6">

                    <h2 className="mb-5 text-xl font-semibold">
                        Quick Actions
                    </h2>

                    <div className="space-y-3">

                        <Link
                            href="/crm/companies/new"
                            className="block rounded-lg border p-3 hover:bg-muted"
                        >
                            ➕ New Company
                        </Link>

                        <Link
                            href="/crm/companies"
                            className="block rounded-lg border p-3 hover:bg-muted"
                        >
                            🏢 Companies
                        </Link>

                        <div className="rounded-lg border p-3 text-muted-foreground">
                            👤 Leads (Coming Soon)
                        </div>

                        <div className="rounded-lg border p-3 text-muted-foreground">
                            💰 Invoices (Coming Soon)
                        </div>

                    </div>

                </div>

            </section>

        </main>

    );

}

function DashboardCard({

    title,

    value,

}: {

    title: string;

    value: number | string;

}) {

    return (

        <div className="rounded-xl border bg-background p-6">

            <p className="text-sm text-muted-foreground">

                {title}

            </p>

            <h2 className="mt-3 text-3xl font-bold">

                {value}

            </h2>

        </div>

    );

}