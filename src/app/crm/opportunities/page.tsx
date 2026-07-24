import {
    getOpportunities,
    getOpportunitySummary,
} from './actions';


import {
    OpportunitiesSummary,
    OpportunitiesTable,
} from '@/components/crm/opportunities';



export default async function OpportunitiesPage(){


    const opportunities =
        await getOpportunities();


    const summary =
        await getOpportunitySummary();



    return (

        <div className="space-y-6">

            <h1 className="text-2xl font-semibold">
                Opportunities
            </h1>


            <OpportunitiesSummary
                summary={summary}
            />


            <OpportunitiesTable
                opportunities={opportunities}
            />


        </div>

    );

}
