import {

    getPolicies,

} from "./page-actions";



import PolicyDialog from "@/components/admin/policies/PolicyDialog";



import PolicyTable from "@/components/admin/policies/PolicyTable";







export default async function PoliciesPage(){



    const policies =

        await getPolicies();







    return (



        <div className="space-y-6">







            <div className="flex items-center justify-between">







                <div>







                    <h1 className="text-3xl font-bold">



                        Policies



                    </h1>









                    <p className="text-sm text-gray-500">



                        Manage organization policies and governance rules.



                    </p>







                </div>









                <PolicyDialog />







            </div>









            <PolicyTable



                items={policies}



            />







        </div>



    );



}