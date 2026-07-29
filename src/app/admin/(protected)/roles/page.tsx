import { RolesRepository } from "@/repositories/admin/RolesRepository";
import { RolesService } from "@/services/admin/RolesService";
import RolesTable from "@/components/admin/roles/RolesTable";
import { createClient } from "@/lib/supabase/server";


export const dynamic = "force-dynamic";


export default async function RolesPage() {


    const supabase =
        await createClient();


    const repository =
        new RolesRepository(
            supabase
        );


    const service =
        new RolesService(
            repository
        );


    const roles =
        await service.list();



    return (

        <main className="space-y-8 p-8">


            <section>

                <h1 className="text-3xl font-bold">
                    Roles
                </h1>


                <p className="text-muted-foreground">
                    Manage platform and organization roles.
                </p>

            </section>



            <section className="rounded-xl border overflow-x-auto">

                <RolesTable
                    roles={roles}
                />


            </section>


        </main>

    );

}
