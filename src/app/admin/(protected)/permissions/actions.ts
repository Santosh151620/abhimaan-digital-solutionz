"use server";

import {
    revalidatePath,
} from "next/cache";

import {
    createClient,
} from "@/lib/supabase/server";

import {
    PermissionsRepository,
} from "@/repositories/admin/PermissionsRepository";

import {
    PermissionsService,
} from "@/services/admin/PermissionsService";

import type {
    Permission,
} from "@/types/admin/Permission";



async function getService() {

    const supabase =
        await createClient();


    const repository =
        new PermissionsRepository(
            supabase,
        );


    return new PermissionsService(
        repository,
    );

}




function validatePermissionInput(
    data:Partial<Permission>,
) {


    if (!data.key?.trim()) {

        throw new Error(
            "Permission key is required.",
        );

    }


    if (!data.name?.trim()) {

        throw new Error(
            "Permission name is required.",
        );

    }


    if (!data.module?.trim()) {

        throw new Error(
            "Permission module is required.",
        );

    }


    if (!data.action?.trim()) {

        throw new Error(
            "Permission action is required.",
        );

    }

}



function validateId(
    id:string,
) {

    if (!id.trim()) {

        throw new Error(
            "Permission ID is required.",
        );

    }

}



function protectSystemPermission(
    permission:Permission,
) {

    if(permission.isSystem){

        throw new Error(
            "System permissions cannot be modified.",
        );

    }

}




export async function createPermission(

    data:Partial<Permission>,

) {


    validatePermissionInput(
        data,
    );


    const service =
        await getService();


    const now =
        new Date()
            .toISOString();



    const permission:Permission = {


        id:
            crypto.randomUUID(),


        organizationId:
            data.organizationId,


        key:
            data.key!
                .trim()
                .toLowerCase(),


        name:
            data.name!
                .trim(),


        description:
            data.description?.trim(),


        module:
            data.module!
                .trim(),


        action:
            data.action!
                .trim(),


        type:
            data.type ?? "Custom",


        isSystem:
            false,


        isActive:
            data.isActive ?? true,


        metadata:
            data.metadata ?? {},


        createdAt:
            now,


        updatedAt:
            now,

    };



    await service.save(
        permission,
    );



    revalidatePath(
        "/admin/permissions",
    );



    return {

        success:true,

        id:
            permission.id,

    };

}




export async function updatePermission(

    permission:Permission,

) {


    validateId(
        permission.id,
    );


    protectSystemPermission(
        permission,
    );


    validatePermissionInput(
        permission,
    );



    const service =
        await getService();



    await service.save({

        ...permission,


        key:
            permission.key
                .trim()
                .toLowerCase(),


        name:
            permission.name
                .trim(),


        module:
            permission.module
                .trim(),


        action:
            permission.action
                .trim(),


        description:
            permission.description?.trim(),


        updatedAt:
            new Date()
                .toISOString(),

    });



    revalidatePath(
        "/admin/permissions",
    );



    return {

        success:true,

    };

}





export async function deletePermission(

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
        "/admin/permissions",
    );



    return {

        success:true,

    };

}