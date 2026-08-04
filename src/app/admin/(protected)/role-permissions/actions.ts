"use server";

import {
    createClient,
} from "@/lib/supabase/server";

import {
    RolePermissionRepository,
} from "@/repositories/admin/RolePermissionRepository";

import {
    RolePermissionService,
} from "@/services/admin/RolePermissionService";



async function getService() {

    const supabase =
        await createClient();

    const repository =
        new RolePermissionRepository(
            supabase,
        );

    return new RolePermissionService(
        repository,
    );

}



export async function assignPermission(

    roleId: string,

    permissionId: string,

) {

    const service =
        await getService();

    await service.assign(
        roleId,
        permissionId,
    );

    return {
        success: true,
    };

}



export async function revokePermission(

    roleId: string,

    permissionId: string,

) {

    const service =
        await getService();

    await service.revoke(
        roleId,
        permissionId,
    );

    return {
        success: true,
    };

}



export async function replacePermissions(

    roleId: string,

    permissionIds: string[],

) {

    const service =
        await getService();

    await service.replace(
        roleId,
        permissionIds,
    );

    return {
        success: true,
    };

}



export async function getRolePermissions(
    roleId: string,
) {

    const service =
        await getService();

    return await service.listByRole(
        roleId,
    );

}