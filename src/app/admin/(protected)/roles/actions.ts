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