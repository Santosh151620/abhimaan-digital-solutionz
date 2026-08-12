import Link from "next/link";

import CRMPageLayout from "@/components/crm/shared/layout/CRMPageLayout";

import EntityOverviewGrid from "@/components/entities/EntityOverviewGrid";
import EntityWorkspace from "@/components/entities/EntityWorkspace";

import {
    CompaniesServiceInstance,
} from "@/services/crm/CompaniesService";


interface PageProps {

    params: Promise<{
        id: string;
    }>;

}



export default async function CompanyDetailsPage({

    params,

}: PageProps) {


    const {
        id,
    } = await params;



    const company =
        await CompaniesServiceInstance.details(id);



    if (!company) {

        return (

            <CRMPageLayout>


                <div
                    className="
                        rounded-2xl
                        border
                        border-white/10
                        bg-[#111111]
                        p-8
                        text-center
                    "
                >

                    <h2
                        className="
                            text-xl
                            font-semibold
                            text-white
                        "
                    >
                        No company to view
                    </h2>


                    <p
                        className="
                            mt-2
                            text-sm
                            text-slate-400
                        "
                    >
                        The company may have been removed
                        or does not exist.
                    </p>



                    <Link

                        href="/crm/companies"

                        className="
                            mt-5
                            inline-flex
                            rounded-xl
                            bg-amber-300
                            px-5
                            py-2
                            text-sm
                            font-semibold
                            text-black
                        "

                    >

                        Back to Companies

                    </Link>


                </div>


            </CRMPageLayout>

        );

    }



    return (

        <CRMPageLayout>


            <div
                className="
                    flex
                    items-start
                    justify-between
                "
            >


                <div>

                    <h1
                        className="
                            text-3xl
                            font-bold
                            text-white
                        "
                    >

                        {company.name}

                    </h1>


                    <p
                        className="
                            text-slate-400
                        "
                    >
                        Company Details
                    </p>


                </div>



                <div
                    className="
                        flex
                        gap-2
                    "
                >

                    <Link

                        href="/crm/companies"

                        className="
                            rounded-xl
                            border
                            border-white/10
                            px-4
                            py-2
                            text-sm
                            text-slate-300
                            hover:bg-white/5
                        "

                    >

                        Back

                    </Link>



                    <Link

                        href={`/crm/companies/${company.id}/edit`}

                        className="
                            rounded-xl
                            bg-amber-300
                            px-4
                            py-2
                            text-sm
                            font-semibold
                            text-black
                        "

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