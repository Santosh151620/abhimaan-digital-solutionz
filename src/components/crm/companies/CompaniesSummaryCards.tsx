'use client';


import {
    useMemo,
} from 'react';


import {
    useCompanies,
} from '@/hooks/crm/useCompanies';





export function CompaniesSummaryCards() {


    const {

        data = [],

        isLoading,

    } = useCompanies();





    const summary = useMemo(() => {


        return {


            total:

                data.length,



            active:

                data.filter(

                    company =>

                        company.status === 'ACTIVE'

                ).length,



            prospects:

                data.filter(

                    company =>

                        company.status === 'PROSPECT'

                ).length,



            inactive:

                data.filter(

                    company =>

                        company.status === 'INACTIVE'

                ).length,



            archived:

                data.filter(

                    company =>

                        company.status === 'ARCHIVED'

                ).length,


        };


    }, [data]);





    const cards = [


        {

            title: 'Total Companies',

            value: summary.total,

            description:
                'All companies in the current view',

        },


        {

            title: 'Active',

            value: summary.active,

            description:
                'Currently active companies',

        },


        {

            title: 'Prospects',

            value: summary.prospects,

            description:
                'Companies currently in prospect status',

        },


        {

            title: 'Inactive',

            value: summary.inactive,

            description:
                'Inactive companies',

        },


        {

            title: 'Archived',

            value: summary.archived,

            description:
                'Archived companies',

        },


    ];





    if (isLoading) {


        return (


            <section

                aria-label="Company summary"

                aria-busy="true"

                className="
                    grid
                    gap-4
                    sm:grid-cols-2
                    lg:grid-cols-5
                "

            >


                {

                    cards.map(card => (


                        <div

                            key={card.title}

                            className="
                                h-28
                                animate-pulse
                                rounded-xl
                                border
                                bg-muted
                            "

                        >

                            <span className="sr-only">

                                Loading {card.title}

                            </span>


                        </div>


                    ))

                }


            </section>


        );

    }





    return (


        <section

            aria-label="Company summary"

            className="
                grid
                gap-4
                sm:grid-cols-2
                lg:grid-cols-5
            "

        >


            {

                cards.map(card => (


                    <article

                        key={card.title}

                        className="
                            crm-card
                            p-5
                            transition
                            hover:-translate-y-0.5
                            hover:shadow-md
                        "

                    >


                        <p className="text-sm text-muted-foreground">

                            {card.title}

                        </p>



                        <p className="
                            mt-3
                            text-3xl
                            font-bold
                            tabular-nums
                        ">

                            {card.value}

                        </p>



                        <p className="
                            mt-2
                            text-xs
                            text-muted-foreground
                        ">

                            {card.description}

                        </p>


                    </article>


                ))

            }


        </section>


    );

}