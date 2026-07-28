import { UsersRepository } from "@/repositories/admin/UsersRepository";
import { UsersService } from "@/services/admin/UsersService";

import { createClient } from "@/lib/supabase/server";


export const dynamic = "force-dynamic";


export default async function UsersPage() {


    const supabase =
        await createClient();


    const repository =
        new UsersRepository(
            supabase
        );


    const service =
        new UsersService(
            repository
        );


    const users =
        await service.list();



    return (

        <main className="space-y-8 p-8">


            <section>

                <h1 className="text-3xl font-bold">
                    Users
                </h1>


                <p className="text-muted-foreground">
                    Manage platform users and access.
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
                                Email
                            </th>

                            <th className="p-3 text-left">
                                Status
                            </th>


                        </tr>

                    </thead>



                    <tbody>


                    {
                        users.map(
                            (user) => (

                                <tr
                                    key={user.id}
                                    className="border-b"
                                >

                                    <td className="p-3">
                                        {user.fullName}
                                    </td>


                                    <td className="p-3">
                                        {user.email}
                                    </td>


                                    <td className="p-3">
                                        {user.status}
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