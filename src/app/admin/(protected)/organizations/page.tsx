import { OrganizationsRepository } from "@/repositories/admin/OrganizationsRepository";
import { OrganizationsService } from "@/services/admin/OrganizationsService";

import { createClient } from "@/lib/supabase/server";
import OrganizationsTable from "@/components/admin/organizations/OrganizationsTable";

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
                <OrganizationsTable

                    organizations={organizations}

                />

            </section>


        </main>

    );

}
