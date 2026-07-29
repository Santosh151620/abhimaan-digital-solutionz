import Link from "next/link";

import type { Company } from "@/types/crm/Companies";

import { CompaniesServiceInstance } from "@/services/crm/CompaniesService";

import DashboardCards from "@/components/admin/dashboard/DashboardCards";
import SystemHealthCard from "@/components/admin/dashboard/SystemHealthCard";


export const dynamic = "force-dynamic";


export default async function DashboardPage() {


    let companies: Company[] = [];


    try {

        companies =
            await CompaniesServiceInstance.list();

    }

    catch {

        companies = [];

    }


    const activeCompanies =
        companies.filter(
            (company) =>
                company.status === "ACTIVE"
        ).length;


    const prospects =
        companies.filter(
            (company) =>
                company.status === "PROSPECT"
        ).length;



    const dashboardCards = [

        {
            title: "Companies",
            value: companies.length,
            description: "Total registered companies",
        },

        {
            title: "Active Companies",
            value: activeCompanies,
            description: "Currently active customers",
        },

        {
            title: "Prospects",
            value: prospects,
            description: "Potential opportunities",
        },

        {
            title: "Open Leads",
            value: 0,
            description: "Lead pipeline tracking",
        },

    ];



    return (

        <main className="space-y-8 p-8">


            <section>

                <h1 className="text-3xl font-bold">
                    Admin Dashboard
                </h1>


                <p className="text-muted-foreground">
                    Platform overview and business administration summary.
                </p>


            </section>



            <DashboardCards
                cards={dashboardCards}
            />



            <SystemHealthCard
                status="Healthy"
                lastChecked={
                    new Date()
                        .toLocaleString()
                }
            />



            <section className="grid gap-6 xl:grid-cols-3">


                <div
                    className="
                        rounded-xl
                        border
                        bg-background
                        p-6
                        xl:col-span-2
                    "
                >


                    <div
                        className="
                            mb-5
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <h2 className="text-xl font-semibold">
                            Recent Companies
                        </h2>


                        <Link

                            href="/crm/companies"

                            className="
                                text-primary
                                hover:underline
                            "

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


                                {
                                    companies
                                        .slice(0, 5)
                                        .map((company) => (


                                        <tr

                                            key={company.id}

                                            className="
                                                border-b
                                                hover:bg-muted/20
                                            "

                                        >


                                            <td className="p-3">


                                                <Link

                                                    href={`/crm/companies/${company.id}`}

                                                    className="
                                                        font-medium
                                                        hover:text-primary
                                                    "

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


                                    ))
                                }


                            </tbody>


                        </table>


                    </div>


                </div>





                <div
                    className="
                        rounded-xl
                        border
                        bg-background
                        p-6
                    "
                >


                    <h2 className="mb-5 text-xl font-semibold">

                        Quick Actions

                    </h2>



                    <div className="space-y-3">


                        <Link

                            href="/crm/companies/new"

                            className="
                                block
                                rounded-lg
                                border
                                p-3
                                hover:bg-muted
                            "

                        >

                            ➕ New Company

                        </Link>



                        <Link

                            href="/crm/companies"

                            className="
                                block
                                rounded-lg
                                border
                                p-3
                                hover:bg-muted
                            "

                        >

                            🏢 Companies

                        </Link>



                        <div
                            className="
                                rounded-lg
                                border
                                p-3
                                text-muted-foreground
                            "
                        >

                            👤 Leads (Coming Soon)

                        </div>



                        <div
                            className="
                                rounded-lg
                                border
                                p-3
                                text-muted-foreground
                            "
                        >

                            💰 Revenue Analytics (Coming Soon)

                        </div>


                    </div>


                </div>


            </section>


        </main>

    );

}
