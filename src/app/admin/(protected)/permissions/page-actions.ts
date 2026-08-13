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




async function getActivePermissions():
Promise<Permission[]> {


    const service =
        await getService();


    return service.active();

}





async function searchPermissions(
    keyword:string,
):
Promise<Permission[]> {


    if(!keyword.trim()) {

        return [];

    }


    const service =
        await getService();


    return service.search(
        keyword.trim(),
    );

}





async function getPermission(
    id:string,
):
Promise<Permission | null> {


    if(!id.trim()) {

        throw new Error(
            "Permission ID is required.",
        );

    }


    const service =
        await getService();


    return service.findById(
        id,
    );

}