import { OrganizationsRepository } from "@/repositories/admin/OrganizationsRepository";
import { OrganizationsService } from "@/services/admin/OrganizationsService";

import { createClient } from "@/lib/supabase/server";


export const dynamic = "force-dynamic";


export default async function OrganizationsPage() {


    const supabase =
        await createClient();



    const repository =
        new OrganizationsRepository(
            supabase
        );


    const service =
        new OrganizationsService(
            repository
        );



    const organizations =
        await service.list();



    return (

        <main className="space-y-8 p-8">


            <section>

                <h1 className="text-3xl font-bold">
                    Organizations
                </h1>


                <p className="text-muted-foreground">
                    Manage platform organizations and tenants.
                </p>


            </section>



            <section
                className="
                    rounded-xl
                    border
                    bg-background
                    overflow-x-auto
                "
            >


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
                                Type
                            </th>

                            <th className="p-3 text-left">
                                Status
                            </th>

                        </tr>

                    </thead>



                    <tbody>


                    {
                        organizations.map(
                            (organization) => (

                                <tr
                                    key={organization.id}
                                    className="border-b"
                                >

                                    <td className="p-3">
                                        {organization.name}
                                    </td>


                                    <td className="p-3">
                                        {organization.code}
                                    </td>


                                    <td className="p-3">
                                        {organization.type}
                                    </td>


                                    <td className="p-3">
                                        {organization.status}
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