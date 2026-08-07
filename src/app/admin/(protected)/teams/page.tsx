import {

    getTeams,

} from "./page-actions";



import TeamDialog from "@/components/admin/teams/TeamDialog";


import TeamTable from "@/components/admin/teams/TeamTable";





export default async function TeamsPage(){



    const teams =

        await getTeams();





    return (


        <div className="space-y-6">





            <div className="flex items-center justify-between">



                <div>



                    <h1 className="text-3xl font-bold">

                        Teams

                    </h1>




                    <p className="text-sm text-gray-500">

                        Manage organization teams and team structure.

                    </p>



                </div>





                <TeamDialog />


            </div>






            <TeamTable

                items={teams}

            />





        </div>


    );


}