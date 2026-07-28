import { PermissionsRepository } from "@/repositories/admin/PermissionsRepository";
import { PermissionsService } from "@/services/admin/PermissionsService";

import { createClient } from "@/lib/supabase/server";


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


                <table className="min-w-full">


                    <thead>

                        <tr className="border-b">

                            <th className="p-3 text-left">
                                Name
                            </th>


                            <th className="p-3 text-left">
                                Module
                            </th>


                            <th className="p-3 text-left">
                                Action
                            </th>


                            <th className="p-3 text-left">
                                Scope
                            </th>


                        </tr>

                    </thead>



                    <tbody>


                    {
                        permissions.map(
                            (permission) => (

                                <tr
                                    key={permission.id}
                                    className="border-b"
                                >

                                    <td className="p-3">
                                        {permission.name}
                                    </td>


                                    <td className="p-3">
                                        {permission.module}
                                    </td>


                                    <td className="p-3">
                                        {permission.action}
                                    </td>


                                    <td className="p-3">
                                        {permission.scope}
                                    </td>


                                </tr>

                            )
                        )
                    }


                    </tbody>


                </table>


            </section>


        </main>

    );

}