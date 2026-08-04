"use server";

import {
    RolePermissionRepository,
} from "@/repositories/admin/RolePermissionRepository";

import {
    RolePermissionService,
} from "@/services/admin/RolePermissionService";

import {
    createClient,
} from "@/lib/supabase/server";


import {
    RolesRepository,
} from "@/repositories/admin/RolesRepository";


import {
    RolesService,
} from "@/services/admin/RolesService";


import type {
    Role,
} from "@/types/admin/Role";



function getService(){

    return createClient()
        .then(
            supabase =>
                new RolesService(
                    new RolesRepository(
                        supabase
                    )
                )
        );

}




export async function createRole(
    data: Partial<Role>,
){

    const service =
        await getService();


    await service.save(
        data as Role
    );

}




export async function updateRole(
    data: Role,
){

    const service =
        await getService();


    await service.save(
        data
    );

}




export async function deleteRole(
    id:string,
){

    const service =
        await getService();


    await service.delete(
        id
    );

}


async function getRolePermissionService() {

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

export async function assignRolePermission(

    roleId: string,

    permissionId: string,

) {

    const service =
        await getRolePermissionService();


    await service.assign(
        roleId,
        permissionId,
    );


    return {
        success: true,
    };

}




export async function revokeRolePermission(

    roleId: string,

    permissionId: string,

) {

    const service =
        await getRolePermissionService();


    await service.revoke(
        roleId,
        permissionId,
    );


    return {
        success: true,
    };

}