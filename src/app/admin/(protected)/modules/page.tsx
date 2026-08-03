import ModulesTable from "@/components/admin/modules/ModulesTable";
import { ModulesRepository } from "@/repositories/admin/ModulesRepository";
import { ModulesService } from "@/services/admin/ModulesService";

export const dynamic = "force-dynamic";

export default async function ModulesPage() {

    const repository =
        await ModulesRepository.create();

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

            <section className="rounded-xl border overflow-x-auto">

                <ModulesTable
                    modules={modules}
                />

            </section>

        </main>

    );

}