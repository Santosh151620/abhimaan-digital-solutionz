"use client";

import type { ReactNode } from "react";

import type { CRMAnalytics } from "@/services/analytics";


type Props = {
    data: CRMAnalytics;
};


type CardProps = {
    title: string;

    value: ReactNode;

    subtitle: string;

    color?: string;

    description?: string;
};



function formatCurrency(
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



function KPICard({

    title,

    value,

    subtitle,

    color = "text-white",

    description,

}: CardProps) {


    return (

        <div
            className="
                group
                relative
                min-h-[180px]
                rounded-2xl
                border
                border-slate-800
                bg-slate-950/80
                p-5
                transition-all
                duration-200
                hover:-translate-y-1
                hover:border-amber-300/30
                hover:shadow-xl
                hover:shadow-black/30
            "
        >

            <div
                className="
                    flex
                    items-center
                    justify-between
                "
            >

                <p
                    className="
                        truncate
                        text-[11px]
                        font-bold
                        uppercase
                        tracking-[0.15em]
                        text-slate-400
                    "
                >
                    {title}
                </p>


                <span
                    className="
                        h-2
                        w-2
                        shrink-0
                        rounded-full
                        bg-amber-300
                    "
                />

            </div>



            <p
                className={`
                    mt-6
                    truncate
                    text-3xl
                    font-black
                    tracking-tight
                    ${color}
                `}
            >
                {value}
            </p>



            <p
                className="
                    mt-3
                    text-sm
                    text-slate-400
                "
            >
                {subtitle}
            </p>



            {description && (

                <div
                    className="
                        absolute
                        inset-x-4
                        bottom-4
                        rounded-xl
                        border
                        border-amber-300/20
                        bg-slate-950
                        px-3
                        py-2
                        text-xs
                        text-slate-300
                        opacity-0
                        transition
                        group-hover:opacity-100
                    "
                >
                    {description}
                </div>

            )}

        </div>

    );

}



export default function AnalyticsCards({
    data,
}: Props) {


    const overviewCards: CardProps[] = [

        {
            title: "Total Leads",

            value:
                data.overview.totalLeads,

            subtitle:
                "Sales pipeline",

        },

        {
            title: "New Leads",

            value:
                data.overview.newLeads,

            subtitle:
                "Awaiting qualification",

            color:
                "text-cyan-300",

        },

        {
            title: "Qualified Leads",

            value:
                data.overview.qualifiedLeads,

            subtitle:
                "Sales ready",

            color:
                "text-violet-300",

        },

        {
            title: "Won Leads",

            value:
                data.overview.wonLeads,

            subtitle:
                "Converted",

            color:
                "text-emerald-300",

        },

    ];



    const revenueCards: CardProps[] = [

        {
            title:
                "Revenue Collected",

            value:
                formatCurrency(
                    data.revenue.totalRevenue,
                ),

            subtitle:
                "Actual revenue",

            color:
                "text-emerald-300",

        },


        {
            title:
                "Outstanding",

            value:
                formatCurrency(
                    data.revenue.outstandingRevenue,
                ),

            subtitle:
                "Pending collection",

            color:
                "text-amber-300",

        },


        {
            title:
                "Forecast",

            value:
                formatCurrency(
                    data.revenue.projectedRevenue,
                ),

            subtitle:
                "Expected revenue",

            color:
                "text-violet-300",

        },

    ];



    const paymentCards: CardProps[] = [

        {
            title:
                "Pending Payments",

            value:
                data.payments.pending,

            subtitle:
                "Awaiting collection",

            description:
                "Invoices created but payment is still pending.",

            color:
                "text-amber-300",

        },


        {
            title:
                "Paid Payments",

            value:
                data.payments.paid,

            subtitle:
                "Successfully collected",

            description:
                "Completed customer payments.",

            color:
                "text-emerald-300",

        },


        {
            title:
                "Overdue Payments",

            value:
                data.payments.overdue,

            subtitle:
                "Requires action",

            description:
                "Payments crossing their due date.",

            color:
                "text-red-300",

        },


        {
            title:
                "Cancelled Payments",

            value:
                data.payments.cancelled,

            subtitle:
                "Cancelled records",

            description:
                "Transactions removed from active collection.",

            color:
                "text-slate-300",

        },

    ];



    return (

        <div
            className="
                space-y-10
            "
        >

            <section>

                <h2
                    className="
                        mb-1
                        text-xl
                        font-bold
                        text-white
                    "
                >
                    Business Overview
                </h2>


                <p
                    className="
                        mb-5
                        text-sm
                        text-slate-400
                    "
                >
                    Live operational KPIs
                </p>


                <div
                    className="
                        grid
                        gap-5
                        md:grid-cols-2
                        2xl:grid-cols-4
                    "
                >

                    {overviewCards.map((card)=>(

                        <KPICard
                            key={card.title}
                            {...card}
                        />

                    ))}

                </div>

            </section>




            <section>

                <h2
                    className="
                        mb-1
                        text-xl
                        font-bold
                        text-white
                    "
                >
                    Revenue Snapshot
                </h2>


                <p
                    className="
                        mb-5
                        text-sm
                        text-slate-400
                    "
                >
                    Collections and forecast
                </p>


                <div
                    className="
                        grid
                        gap-5
                        md:grid-cols-3
                    "
                >

                    {revenueCards.map((card)=>(

                        <KPICard
                            key={card.title}
                            {...card}
                        />

                    ))}

                </div>

            </section>




            <section>

                <h2
                    className="
                        mb-1
                        text-xl
                        font-bold
                        text-white
                    "
                >
                    Payment Health
                </h2>


                <p
                    className="
                        mb-5
                        text-sm
                        text-slate-400
                    "
                >
                    Payment lifecycle visibility
                </p>


                <div
                    className="
                        grid
                        gap-5
                        sm:grid-cols-2
                        xl:grid-cols-4
                    "
                >

                    {paymentCards.map((card)=>(

                        <KPICard
                            key={card.title}
                            {...card}
                        />

                    ))}

                </div>

            </section>


        </div>

    );

}