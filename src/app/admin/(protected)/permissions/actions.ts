"use server";


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









export async function createPermission(

    data:Partial<Permission>,

) {



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

            data.key ?? "",





        name:

            data.name ?? "",





        description:

            data.description,





        module:

            data.module ?? "",





        action:

            data.action ?? "",





        type:

            data.type ?? "Custom",





        isSystem:

            false,





        isActive:

            true,





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







    return {

        success:true,

        id:permission.id,

    };



}









export async function updatePermission(

    permission:Permission,

) {



    const service =

        await getService();







    await service.save(

        {

            ...permission,

            updatedAt:

                new Date()

                .toISOString(),

        },

    );







    return {

        success:true,

    };



}









export async function deletePermission(

    id:string,

) {



    const service =

        await getService();







    await service.delete(

        id,

    );







    return {

        success:true,

    };



}