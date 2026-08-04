import {
    createClient,
} from "@/lib/supabase/server";

import {
    RolesRepository,
} from "@/repositories/admin/RolesRepository";

import {
    PermissionsRepository,
} from "@/repositories/admin/PermissionsRepository";

import {
    RolePermissionRepository,
} from "@/repositories/admin/RolePermissionRepository";

import {
    RolesService,
} from "@/services/admin/RolesService";

import {
    PermissionsService,
} from "@/services/admin/PermissionsService";

import {
    RolePermissionService,
} from "@/services/admin/RolePermissionService";

import RolePermissionAssignment
from "@/components/admin/role-permissions/RolePermissionAssignment";

export const dynamic =
    "force-dynamic";

export default async function RolePermissionsPage() {

    const supabase =
        await createClient();

    const rolesService =
        new RolesService(
            new RolesRepository(
                supabase,
            ),
        );

    const permissionsService =
        new PermissionsService(
            new PermissionsRepository(
                supabase,
            ),
        );

    const rolePermissionService =
        new RolePermissionService(
            new RolePermissionRepository(
                supabase,
            ),
        );

    const roles =
        await rolesService.list();

    const permissions =
        await permissionsService.list();

    const selectedRole =
        roles[0];

    const assignedPermissions =
        selectedRole
            ? await rolePermissionService.listByRole(
                selectedRole.id,
            )
            : [];

    return (

        <main className="space-y-8 p-8">

            <section>

                <h1 className="text-3xl font-bold">

                    Role Permissions

                </h1>

                <p className="text-muted-foreground">

                    Configure permission assignments for platform roles.

                </p>

            </section>

            {!selectedRole ? (

                <div className="rounded-xl border p-10 text-center text-muted-foreground">

                    No roles available.

                </div>

            ) : (

                <RolePermissionAssignment

                    role={selectedRole}

                    permissions={permissions}

                    selectedPermissionIds={
                        assignedPermissions.map(
                            item => item.permissionId,
                        )
                    }

                />

            )}

        </main>

    );

}