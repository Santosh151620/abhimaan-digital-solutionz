import { UsersRepository } from "@/repositories/admin/UsersRepository";
import { UsersService } from "@/services/admin/UsersService";

import { createClient } from "@/lib/supabase/server";
import UsersTable from "@/components/admin/users/UsersTable";

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

<UsersTable
    users={users}
/>


            </section>


        </main>

    );

}
