'use client';


import type {
    Company,
} from '@/types/crm/Companies';



interface Props {

    initialCompanies: Company[];

}



export default function CompaniesClient({

    initialCompanies,

}: Props) {


    return (

        <div className="space-y-4">


            <div className="flex items-center justify-between">


                <h2 className="font-semibold">
                    Company List
                </h2>


                <span className="text-sm text-muted-foreground">

                    {initialCompanies.length} records

                </span>


            </div>




            <div className="space-y-3">


                {
                    initialCompanies.length === 0 && (

                        <div className="rounded border p-4 text-sm text-muted-foreground">

                            No companies found.

                        </div>

                    )
                }



                {
                    initialCompanies.map(

                        company => (

                            <div

                                key={company.id}

                                className="rounded-lg border p-4"

                            >

                                <div className="flex justify-between">


                                    <div>


                                        <h3 className="font-medium">

                                            {company.name}

                                        </h3>


                                        {
                                            company.legalName && (

                                                <p className="text-sm text-muted-foreground">

                                                    {company.legalName}

                                                </p>

                                            )
                                        }


                                    </div>




                                    <span className="text-sm">

                                        {company.status}

                                    </span>


                                </div>




                                <div className="mt-2 grid gap-2 text-sm md:grid-cols-3">


                                    {
                                        company.industry && (

                                            <p>
                                                Industry: {company.industry}
                                            </p>

                                        )
                                    }



                                    {
                                        company.email && (

                                            <p>
                                                Email: {company.email}
                                            </p>

                                        )
                                    }



                                    {
                                        company.city && (

                                            <p>
                                                Location: {company.city}
                                            </p>

                                        )
                                    }


                                </div>


                            </div>

                        )

                    )
                }


            </div>


        </div>

    );

}