import { PermissionsRepository } from "@/repositories/admin/PermissionsRepository";
import { PermissionsService } from "@/services/admin/PermissionsService";

import { createClient } from "@/lib/supabase/server";
import PermissionsTable from "@/components/admin/permissions/PermissionsTable";

export const dynamic = "force-dynamic";


export default async function PermissionsPage() {


    const supabase =
        await createClient();


    const repository =
        new PermissionsRepository(
            supabase
        );


    const service =
        new PermissionsService(
            repository
        );


    const permissions =
        await service.list();



    return (

        <main className="space-y-8 p-8">


            <section>

                <h1 className="text-3xl font-bold">
                    Permissions
                </h1>


                <p className="text-muted-foreground">
                    Manage RBAC permissions.
                </p>

            </section>



            <section className="rounded-xl border overflow-x-auto">

                <PermissionsTable
                    permissions={permissions}
                />

            </section>
        </main>

    );

}
