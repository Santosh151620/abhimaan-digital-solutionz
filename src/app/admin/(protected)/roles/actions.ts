"use server";

import {
    revalidatePath,
} from "next/cache";

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


async function getService() {

    const repository =
        new RolesRepository();

    return new RolesService(
        repository,
    );

}


function validateRoleInput(
    data: Partial<Role>,
) {

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

}



function validateId(
    id:string,
) {

    if (!id.trim()) {

        throw new Error(
            "Role ID is required.",
        );

    }

}



function protectSystemRole(
    role:Role,
) {

    if (role.isSystem) {

        throw new Error(
            "System roles cannot be modified.",
        );

    }

}



export async function createRole(
    data:Partial<Role>,
) {

    validateRoleInput(
        data,
    );


    const service =
        await getService();


    const now =
        new Date()
            .toISOString();


    const role:Role = {

        id:
            crypto.randomUUID(),

        organizationId:
            data.organizationId,


        name:
            data.name!.trim(),


        code:
            data.code!
                .trim()
                .toLowerCase(),


        description:
            data.description?.trim(),


        type:
            data.type ?? "Custom",


        level:
            data.level ?? "Organization",


        status:
            data.status ?? "Active",


        permissionIds:
            data.permissionIds ?? [],


        isSystem:
            false,


        isDefault:
            data.isDefault ?? false,


        isActive:
            (data.status ?? "Active")
                === "Active",


        metadata:
            data.metadata ?? {},


        createdAt:
            now,


        updatedAt:
            now,

    };


    await service.save(
        role,
    );


    revalidatePath(
        "/admin/roles",
    );


    return {

        success:true,

        id:role.id,

    };

}





export async function updateRole(
    role:Role,
) {


    validateId(
        role.id,
    );


    protectSystemRole(
        role,
    );


    const service =
        await getService();


    await service.save({

        ...role,


        name:
            role.name.trim(),


        code:
            role.code
                .trim()
                .toLowerCase(),


        isActive:
            role.status === "Active",


        updatedAt:
            new Date()
                .toISOString(),

    });



    revalidatePath(
        "/admin/roles",
    );


    return {

        success:true,

    };

}





export async function deleteRole(
    id:string,
) {


    validateId(
        id,
    );


    const service =
        await getService();


    await service.delete(
        id,
    );


    revalidatePath(
        "/admin/roles",
    );


    return {

        success:true,

    };

}





function validatePermissionMapping(
    roleId:string,
    permissionId:string,
) {


    if (!roleId.trim()) {

        throw new Error(
            "Role ID is required.",
        );

    }


    if (!permissionId.trim()) {

        throw new Error(
            "Permission ID is required.",
        );

    }

}





export async function assignRolePermission(
    roleId:string,
    permissionId:string,
) {


    validatePermissionMapping(
        roleId,
        permissionId,
    );


    const supabase =
        await createClient();



    const {
        error,
    } =
        await supabase
            .from(
                "role_permissions",
            )
            .upsert({

                id:
                    crypto.randomUUID(),


                role_id:
                    roleId,


                permission_id:
                    permissionId,


                created_at:
                    new Date()
                        .toISOString(),

            });



    if(error){

        throw error;

    }



    revalidatePath(
        "/admin/roles",
    );


    return {

        success:true,

    };

}





export async function revokeRolePermission(
    roleId:string,
    permissionId:string,
) {


    validatePermissionMapping(
        roleId,
        permissionId,
    );


    const supabase =
        await createClient();



    const {
        error,
    } =
        await supabase
            .from(
                "role_permissions",
            )
            .delete()
            .eq(
                "role_id",
                roleId,
            )
            .eq(
                "permission_id",
                permissionId,
            );



    if(error){

        throw error;

    }



    revalidatePath(
        "/admin/roles",
    );


    return {

        success:true,

    };

}