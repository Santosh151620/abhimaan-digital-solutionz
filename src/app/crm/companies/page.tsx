import {

    searchCompanies,

    getCompaniesSummary,

} from './actions';



import type {

    Company,

} from '@/types/crm/Companies';

import CompaniesClient from './CompaniesClient';



interface Props {


    searchParams?: Promise<{

        status?:string;

        industry?:string;

        search?:string;

    }>;


}




export default async function CompaniesPage(

    props:Props

) {



    const searchParams =

        await props.searchParams;




    const companies =

        await searchCompanies({

            status:

                searchParams?.status as Company['status'],


            industry:

                searchParams?.industry,


            search:

                searchParams?.search,


        });





    const summary =

        await getCompaniesSummary();





    return (


        <div className="space-y-6">



            <div>


                <h1 className="text-2xl font-semibold">

                    Companies

                </h1>



                <p className="text-sm text-muted-foreground">

                    Manage CRM companies and customer accounts.

                </p>


            </div>





            <div className="grid gap-4 md:grid-cols-4">



                <div className="rounded-lg border p-4">


                    <p className="text-sm text-muted-foreground">

                        Total

                    </p>


                    <p className="text-2xl font-bold">

                        {summary.total}

                    </p>


                </div>





                <div className="rounded-lg border p-4">


                    <p className="text-sm text-muted-foreground">

                        Active

                    </p>


                    <p className="text-2xl font-bold">

                        {summary.active}

                    </p>


                </div>





                <div className="rounded-lg border p-4">


                    <p className="text-sm text-muted-foreground">

                        Prospects

                    </p>


                    <p className="text-2xl font-bold">

                        {summary.prospect}

                    </p>


                </div>





                <div className="rounded-lg border p-4">


                    <p className="text-sm text-muted-foreground">

                        Inactive

                    </p>


                    <p className="text-2xl font-bold">

                        {summary.inactive}

                    </p>


                </div>



            </div>





            <div className="rounded-lg border p-6">


                <CompaniesClient

                    initialCompanies={companies}

                />


            </div>



        </div>


    );

}