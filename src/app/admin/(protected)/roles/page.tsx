import {
    getRoles,
} from "./page-actions";


import RolesClient
from "@/components/admin/roles/RolesClient";


import type {
    Role,
} from "@/types/admin/Role";









export default async function RolesPage() {



    const roles:Role[] =

        await getRoles();







    return (



        <div

            className="space-y-6"

        >



            <div>



                <h1

                    className="

                        text-2xl

                        font-semibold

                    "

                >

                    Roles

                </h1>







                <p

                    className="

                        text-sm

                        text-muted-foreground

                    "

                >

                    Manage platform and organization roles.

                </p>



            </div>









            <RolesClient



                initialRoles={roles}



            />



        </div>



    );



}
