import {
    getPermissions,
} from "./page-actions";

import PermissionsClient from "@/components/admin/permissions/PermissionsClient";

import type {
    Permission,
} from "@/types/admin/Permission";









export default async function PermissionsPage() {



    const permissions:Permission[] =

        await getPermissions();







    return (



        <div

            className="

                space-y-6

            "

        >



            <div>



                <h1

                    className="

                        text-2xl

                        font-semibold

                    "

                >



                    Permissions



                </h1>







                <p

                    className="

                        text-sm

                        text-muted-foreground

                    "

                >



                    Manage platform and organization permissions.



                </p>



            </div>









            <PermissionsClient



                initialPermissions={permissions}



            />



        </div>



    );



}