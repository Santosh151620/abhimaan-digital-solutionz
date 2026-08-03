import {
    RolesRepository,
} from "@/repositories/admin/RolesRepository";


import {
    RolesService,
} from "@/services/admin/RolesService";


import RolesTable
from "@/components/admin/roles/RolesTable";


import RoleDialog
from "@/components/admin/roles/RoleDialog";


import {
    createClient,
} from "@/lib/supabase/server";


import {
    deleteRole,
} from "./actions";


export const dynamic =
    "force-dynamic";



export default async function RolesPage() {


    const supabase =
        await createClient();



    const repository =
        new RolesRepository(
            supabase,
        );



    const service =
        new RolesService(
            repository,
        );



    const roles =
        await service.list();



    return (

        <main className="space-y-8 p-8">


            <section className="flex items-center justify-between">


                <div>

                    <h1 className="text-3xl font-bold">
                        Roles
                    </h1>


                    <p className="text-muted-foreground">
                        Manage platform and organization roles.
                    </p>

                </div>



                <RoleDialog />


            </section>




            <section className="rounded-xl border overflow-x-auto">


                <RolesTable

                    roles={roles}

                    onDelete={deleteRole}

                />


            </section>


        </main>

    );

}