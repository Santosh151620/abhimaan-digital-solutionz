import { RolesRepository } from "@/repositories/admin/RolesRepository";
import { RolesService } from "@/services/admin/RolesService";

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


                <table className="min-w-full">


                    <thead>

                        <tr className="border-b">

                            <th className="p-3 text-left">
                                Name
                            </th>

                            <th className="p-3 text-left">
                                Code
                            </th>

                            <th className="p-3 text-left">
                                Level
                            </th>

                            <th className="p-3 text-left">
                                Status
                            </th>


                        </tr>

                    </thead>



                    <tbody>

                    {
                        roles.map(
                            (role) => (

                                <tr
                                    key={role.id}
                                    className="border-b"
                                >

                                    <td className="p-3">
                                        {role.name}
                                    </td>


                                    <td className="p-3">
                                        {role.code}
                                    </td>


                                    <td className="p-3">
                                        {role.level}
                                    </td>


                                    <td className="p-3">
                                        {role.status}
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