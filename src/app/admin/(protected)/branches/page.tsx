import {

    getBranches,

} from "./page-actions";



import BranchDialog from "@/components/admin/branches/BranchDialog";



import BranchTable from "@/components/admin/branches/BranchTable";







export default async function BranchesPage(){



    const branches =

        await getBranches();







    return (



        <div className="space-y-6">







            <div className="flex items-center justify-between">







                <div>







                    <h1 className="text-3xl font-bold">



                        Branches



                    </h1>









                    <p className="text-sm text-gray-500">



                        Manage organization branches and offices.



                    </p>







                </div>









                <BranchDialog />







            </div>









            <BranchTable



                items={branches}



            />







        </div>



    );



}