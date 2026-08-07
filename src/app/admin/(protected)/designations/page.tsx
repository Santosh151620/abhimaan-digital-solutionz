import {
    getDesignations,
} from "./page-actions";

import DesignationDialog from "@/components/admin/designations/DesignationDialog";

import DesignationTable from "@/components/admin/designations/DesignationTable";


export default async function DesignationsPage() {


    const designations =
        await getDesignations();



    return (

        <div className="space-y-6">


            <div className="flex items-center justify-between">


                <div>


                    <h1 className="text-3xl font-bold">

                        Designations

                    </h1>


                    <p className="text-sm text-gray-500">

                        Manage organization designations and hierarchy.

                    </p>


                </div>



                <DesignationDialog />


            </div>



            <DesignationTable

                items={designations}

            />


        </div>

    );

}