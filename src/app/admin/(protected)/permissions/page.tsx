import {
    createClient,
} from "@/lib/supabase/server";

import {
    PermissionsRepository,
} from "@/repositories/admin/PermissionsRepository";

import {
    PermissionsService,
} from "@/services/admin/PermissionsService";

import PermissionsClient
from "@/components/admin/permissions/PermissionsClient";

export const dynamic = "force-dynamic";

export default async function PermissionsPage() {

    const supabase =
        await createClient();

    const repository =
        new PermissionsRepository(
            supabase,
        );

    const service =
        new PermissionsService(
            repository,
        );

    const permissions =
        await service.list();

    return (

        <main className="p-8">

            <PermissionsClient
                permissions={permissions}
            />

        </main>

    );

}