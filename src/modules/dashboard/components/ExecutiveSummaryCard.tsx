import {
    Activity,
    Building2,
    FolderKanban,
    IndianRupee,
} from "lucide-react";

import type { CRMAnalytics } from "@/services/analytics";


type ExecutiveSummaryCardProps = {
    metrics: CRMAnalytics;
};



function formatCount(
    value: number | undefined,
): string {

    return typeof value === "number" &&
        Number.isFinite(value)

        ? value.toLocaleString("en-IN")

        : "0";

}



function formatRevenue(
    value: number | undefined,
): string {

    if (
        typeof value !== "number" ||
        !Number.isFinite(value)
    ) {
        return "₹0";
    }


    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        },
    ).format(value);

}



export default function ExecutiveSummaryCard({

    metrics,

}: ExecutiveSummaryCardProps) {



    const items = [

        {
            label: "Total Leads",

            value:
                formatCount(
                    metrics.overview.totalLeads,
                ),

            description:
                "Active opportunities",

            icon: Activity,

        },


        {
            label: "Active Clients",

            value:
                formatCount(
                    metrics.overview.activeClients,
                ),

            description:
                "Customer relationships",

            icon: Building2,

        },


        {
            label: "Active Projects",

            value:
                formatCount(
                    metrics.overview.activeProjects,
                ),

            description:
                "Running engagements",

            icon: FolderKanban,

        },


        {
            label: "Revenue",

            value:
                formatRevenue(
                    metrics.revenue.totalRevenue,
                ),

            description:
                "Collected revenue",

            icon: IndianRupee,

        },

    ];




    return (

        <section

            aria-labelledby="executive-summary-title"

            className="
                rounded-2xl
                border
                border-amber-300/20
                bg-slate-900/70
                p-5
                shadow-xl
                shadow-black/20
                backdrop-blur-xl
            "

        >


            <div
                className="
                    mb-5
                "
            >

                <p
                    className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.2em]
                        text-amber-300
                    "
                >
                    Executive Overview
                </p>


                <h2
                    id="executive-summary-title"
                    className="
                        mt-1
                        text-lg
                        font-semibold
                        text-white
                    "
                >
                    Executive Summary
                </h2>


                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-400
                    "
                >
                    Current business performance snapshot.
                </p>

            </div>





            <div

                className="
                    grid
                    gap-4
                    sm:grid-cols-2
                    xl:grid-cols-4
                "

            >


                {items.map((item) => {


                    const Icon =
                        item.icon;



                    return (

                        <div

                            key={item.label}

                            className="
                                min-w-0
                                rounded-xl
                                border
                                border-slate-800
                                bg-slate-950/70
                                px-4
                                py-4
                                transition-all
                                duration-200
                                hover:border-amber-300/30
                            "

                        >



                            <div

                                className="
                                    flex
                                    min-w-0
                                    items-center
                                    gap-3
                                "

                            >


                                <div

                                    className="
                                        flex
                                        h-8
                                        w-8
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-amber-300/10
                                    "

                                >

                                    <Icon

                                        className="
                                            h-4
                                            w-4
                                            text-amber-300
                                        "

                                    />

                                </div>



                                <p

                                    className="
                                       text-xs
                                        font-semibold
                                        uppercase
                                        leading-tight
                                        tracking-wide
                                        text-slate-300
                                    "

                                >

                                    {item.label}

                                </p>


                            </div>





                            <p

                                className="
                                    mt-4
                                    whitespace-nowrap
                                    text-3xl
                                    font-bold
                                    tracking-tight
                                    text-white
                                "

                            >

                                {item.value}

                            </p>





                            <p

                                className="
                                    mt-2
                                    text-xs
                                    text-slate-500
                                "

                            >

                                {item.description}

                            </p>



                        </div>

                    );


                })}


            </div>


        </section>

    );

}