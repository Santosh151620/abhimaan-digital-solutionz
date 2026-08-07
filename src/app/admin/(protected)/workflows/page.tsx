import {

    getWorkflows,

} from "./page-actions";



import WorkflowDialog from "@/components/admin/workflows/WorkflowDialog";



import WorkflowTable from "@/components/admin/workflows/WorkflowTable";







export default async function WorkflowsPage(){



    const workflows =

        await getWorkflows();







    return (



        <div className="space-y-6">







            <div className="flex items-center justify-between">







                <div>







                    <h1 className="text-3xl font-bold">



                        Workflows



                    </h1>









                    <p className="text-sm text-gray-500">



                        Manage automation workflows and business rules.



                    </p>







                </div>









                <WorkflowDialog />







            </div>









            <WorkflowTable



                items={workflows}



            />







        </div>



    );



}