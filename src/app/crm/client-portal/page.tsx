import {
    ClientPortalServiceInstance,
} from '@/services/crm/ClientPortalService';



import {
    ClientPortalClient,
    ClientPortalSummary,
} from '@/components/crm/client-portal';



export default async function ClientPortalPage(){


    const portals =
        await ClientPortalServiceInstance.list();



    const summary =
        await ClientPortalServiceInstance.summary();



    return (

        <div className="space-y-6">


            <ClientPortalSummary
                summary={summary}
            />


            <ClientPortalClient
                portals={portals}
            />


        </div>

    );

}
