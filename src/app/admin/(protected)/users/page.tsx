import {
    UsersRepository,
} from "@/repositories/admin/UsersRepository";


import {
    UsersService,
} from "@/services/admin/UsersService";


import {
    createClient,
} from "@/lib/supabase/server";


import UsersClient
from "@/components/admin/users/UsersClient";



export const dynamic =
    "force-dynamic";



/**
 * ADS Admin Users Management
 *
 * Server Component
 *
 * Responsibilities:
 * - Authentication boundary
 * - Data loading
 * - Tenant scoped repository access
 *
 * Client responsibilities:
 * - CRUD actions
 * - Dialog state
 * - UI interactions
 */
export default async function UsersPage(){


    const supabase =
        await createClient();



    const repository =
        new UsersRepository(
            supabase,
        );



    const service =
        new UsersService(
            repository,
        );



    const users =
        await service.list();



    return (

        <main
            className="
            space-y-8
            p-8
            "
        >


            <section>


                <h1
                    className="
                    text-3xl
                    font-bold
                    "
                >

                    Users

                </h1>



                <p
                    className="
                    text-muted-foreground
                    "
                >

                    Manage platform users,
                    organization access,
                    and identity settings.

                </p>


            </section>



            <section
                className="
                rounded-xl
                border
                p-6
                "
            >


                <UsersClient

                    users={users}

                />


            </section>



        </main>

    );

}