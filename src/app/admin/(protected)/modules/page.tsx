import { ModulesService } from "@/services/admin/ModulesService";
import { ModulesRepository } from "@/repositories/admin/ModulesRepository";

import { createClient } from "@/lib/supabase/server";


export const dynamic = "force-dynamic";


export default async function ModulesPage() {


    const supabase =
        await createClient();



    const repository =
        new ModulesRepository();



    const service =
        new ModulesService(
            repository
        );



    const modules =
        await service.list();



    return (

        <main className="space-y-8 p-8">


            <section>

                <h1 className="text-3xl font-bold">
                    Modules
                </h1>


                <p className="text-muted-foreground">
                    Manage platform capabilities and feature modules.
                </p>


            </section>



            <section className="rounded-xl border overflow-x-auto">


                <table className="min-full">


                    <thead>

                        <tr className="border-b">


                            <th className="p-3 text-left">
                                Name
                            </th>


                            <th className="p-3 text-left">
                                Code
                            </th>


                            <th className="p-3 text-left">
                                Status
                            </th>


                        </tr>


                    </thead>



                    <tbody>


                    {
                        modules.map(
                            (module) => (

                                <tr
                                    key={module.id}
                                    className="border-b"
                                >

                                    <td className="p-3">
                                        {module.name}
                                    </td>


                                    <td className="p-3">
                                        {module.code}
                                    </td>


                                    <td className="p-3">
                                        {module.status}
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