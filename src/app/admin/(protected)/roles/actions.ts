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


import type {
    Role,
} from "@/types/admin/Role";









async function getService() {



    const supabase =

        await createClient();







    const repository =

        new RolesRepository(

            supabase,

        );







    return new RolesService(

        repository,

    );



}









export async function createRole(

    data:Partial<Role>,

) {



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

            data.name ?? "",





        code:

            data.code ?? "",





        description:

            data.description,





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

            true,





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







    return {



        success:true,

        id:role.id,



    };



}









export async function updateRole(

    role:Role,

) {



    const service =

        await getService();







    await service.save(

        {

            ...role,

            updatedAt:

                new Date()

                .toISOString(),

        },

    );







    return {



        success:true,



    };



}









export async function deleteRole(

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









export async function assignRolePermission(

    roleId:string,

    permissionId:string,

) {



    const supabase =

        await createClient();







    const {

        error,

    } = await supabase

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







    if(error)

        throw error;







    return {



        success:true,



    };



}









export async function revokeRolePermission(

    roleId:string,

    permissionId:string,

) {



    const supabase =

        await createClient();







    const {

        error,

    } = await supabase

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







    if(error)

        throw error;







    return {



        success:true,



    };



}