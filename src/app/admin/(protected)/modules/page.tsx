import ModulesTable from "@/components/admin/modules/ModulesTable";

import {
    ModulesRepository,
} from "@/repositories/admin/ModulesRepository";

import {
    ModulesService,
} from "@/services/admin/ModulesService";

import {
    createSupabaseServerClient,
} from "@/lib/supabase/server-client";


export const dynamic =
    "force-dynamic";


export default async function ModulesPage() {

    const supabase =
        await createSupabaseServerClient();


    const repository =
        new ModulesRepository(
            supabase,
        );


    const service =
        new ModulesService(
            repository,
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


            <section className="overflow-x-auto rounded-xl border">

                <ModulesTable
                    modules={modules}
                />

            </section>

        </main>

    );

}