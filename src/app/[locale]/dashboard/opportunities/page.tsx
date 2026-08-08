import {
    createClient,
} from '@/lib/supabase/server';

import {
    createOpportunitiesRepository,
} from '@/repositories/crm/OpportunitiesRepository';

import OpportunitiesClient from '@/components/crm/opportunities/OpportunitiesClient';


export const dynamic = 'force-dynamic';


interface OpportunitiesPageProps {

    params: Promise<{
        locale: string;
    }>;

}


export default async function OpportunitiesPage({

    params,

}: OpportunitiesPageProps) {


    const {
        locale,
    } = await params;


    const supabase =
        await createClient();


    const repository =
        createOpportunitiesRepository(
            supabase,
        );


    const opportunities =
        await repository.list();


    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-3xl font-bold tracking-tight">
                    Opportunities
                </h1>

                <p className="text-muted-foreground">
                    Manage sales opportunities, deal values, pipeline stages,
                    forecasting and revenue generation.
                </p>

            </div>


            <OpportunitiesClient
                initialOpportunities={
                    opportunities
                }
                locale={
                    locale
                }
            />

        </div>

    );

}
