import {
    PermissionsRepository,
} from "@/repositories/admin/PermissionsRepository";


import {
    PermissionsService,
} from "@/services/admin/PermissionsService";


import PermissionsTable
from "@/components/admin/permissions/PermissionsTable";


import PermissionDialog
from "@/components/admin/permissions/PermissionDialog";


import {
    createClient,
} from "@/lib/supabase/server";


import {
    deletePermission,
} from "./actions";



export const dynamic =
    "force-dynamic";



export default async function PermissionsPage() {


    const supabase =
        await createClient();



    const repository =
        new PermissionsRepository(
            supabase,
        );



    const service =
        new PermissionsService(
            repository,
        );



    const permissions =
        await service.list();



    return (

        <main className="space-y-8 p-8">


            <section
                className="
                flex
                items-center
                justify-between
                "
            >


                <div>


                    <h1 className="text-3xl font-bold">

                        Permissions

                    </h1>



                    <p className="text-muted-foreground">

                        Manage RBAC permissions and access rules.

                    </p>


                </div>



                <PermissionDialog />


            </section>





            <section
                className="
                overflow-x-auto
                rounded-xl
                border
                "
            >


                <PermissionsTable

                    permissions={permissions}

                />


            </section>


        </main>

    );

}