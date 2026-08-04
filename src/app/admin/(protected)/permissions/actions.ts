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



export async function savePermission(
    permission: Permission,
): Promise<void> {


    const supabase =
        await createClient();



    const repository =
        new PermissionsRepository(
            supabase,
        );



    const service =
        new PermissionsService(
            repository,
        );



    await service.save(
        permission,
    );

}




export async function deletePermission(
    id: string,
): Promise<void> {


    const supabase =
        await createClient();



    const repository =
        new PermissionsRepository(
            supabase,
        );



    const service =
        new PermissionsService(
            repository,
        );



    await service.delete(
        id,
    );

}