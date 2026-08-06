"use server";

import {
    createClient,
} from "@/lib/supabase/server";


import {
    RolesRepository,
} from "@/repositories/admin/RolesRepository";


import {
    RolesService,
} from "@/services/admin/RolesService";


import {
    RolePermissionRepository,
} from "@/repositories/admin/RolePermissionRepository";


import {
    RolePermissionService,
} from "@/services/admin/RolePermissionService";


import type {
    Role,
} from "@/types/admin/Role";



async function getRolesService(): Promise<RolesService> {

    const supabase =
        await createClient();


    return new RolesService(

        new RolesRepository(
            supabase,
        ),

    );

}



async function getRolePermissionService(): Promise<RolePermissionService> {

    const supabase =
        await createClient();


    return new RolePermissionService(

        new RolePermissionRepository(
            supabase,
        ),

    );

}



export async function createRole(
    data: Partial<Role>,
): Promise<{ success: boolean }> {


    const service =
        await getRolesService();



    if (!data.name?.trim()) {

        throw new Error(
            "Role name is required.",
        );

    }



    if (!data.code?.trim()) {

        throw new Error(
            "Role code is required.",
        );

    }



    if (
        await service.existsByCode(
            data.code,
        )
    ) {

        throw new Error(
            "Role code already exists.",
        );

    }



    if (
        await service.existsByName(
            data.name,
        )
    ) {

        throw new Error(
            "Role name already exists.",
        );

    }



    await service.save(
        data as Role,
    );



    return {
        success: true,
    };

}




export async function updateRole(
    data: Role,
): Promise<{ success: boolean }> {


    const service =
        await getRolesService();


    await service.save(
        data,
    );


    return {
        success: true,
    };

}




export async function deleteRole(
    id: string,
): Promise<{ success: boolean }> {


    const service =
        await getRolesService();


    await service.delete(
        id,
    );


    return {
        success: true,
    };

}




export async function searchRoles(
    keyword: string,
): Promise<Role[]> {


    const service =
        await getRolesService();


    return service.search(
        keyword,
    );

}




export async function listActiveRoles(): Promise<Role[]> {


    const service =
        await getRolesService();


    return service.active();

}




export async function listSystemRoles(): Promise<Role[]> {


    const service =
        await getRolesService();


    return service.systemRoles();

}




export async function listCustomRoles(): Promise<Role[]> {


    const service =
        await getRolesService();


    return service.customRoles();

}




export async function assignRolePermission(
    roleId: string,
    permissionId: string,
): Promise<{ success: boolean }> {


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
): Promise<{ success: boolean }> {


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