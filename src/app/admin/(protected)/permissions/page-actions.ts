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









export async function getPermissions():

Promise<Permission[]> {



    const service =

        await getService();







    return service.list();



}