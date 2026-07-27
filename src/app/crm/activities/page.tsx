import {
    ActivityClient,
} from '@/components/crm/activities';


import {
    ActivityServiceInstance,
} from '@/services/crm/ActivityService';



export default async function Page() {

   const activities =
    await ActivityServiceInstance.list();
    return (

        <div className="space-y-6">


            <div>

                <h1 className="text-2xl font-semibold">

                    Activities

                </h1>


                <p className="text-sm text-muted-foreground">

                    Manage CRM activities, meetings, calls and follow-ups.

                </p>


            </div>



            <ActivityClient

                initialActivities={
                    activities
                }

            />


        </div>

    );


}

