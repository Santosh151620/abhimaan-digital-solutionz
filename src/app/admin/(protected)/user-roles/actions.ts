"use server";

import { revalidatePath } from "next/cache";

import {
    createClient,
} from "@/lib/supabase/server";

import {
    UserRoleRepository,
} from "@/repositories/admin/UserRoleRepository";

import {
    UserRoleService,
} from "@/services/admin/UserRoleService";



async function getService(): Promise<UserRoleService> {

    const supabase =
        await createClient();

    const repository =
        new UserRoleRepository(
            supabase,
        );

    return new UserRoleService(
        repository,
    );

}



export async function assignRoleToUser(

    userId: string,

    roleId: string,

): Promise<void> {

    const service =
        await getService();

    await service.assignRole(
        userId,
        roleId,
    );

    revalidatePath(
        "/admin/users",
    );

    revalidatePath(
        "/admin/roles",
    );

}



export async function removeRoleFromUser(

    userId: string,

    roleId: string,

): Promise<void> {

    const service =
        await getService();

    await service.removeRole(
        userId,
        roleId,
    );

    revalidatePath(
        "/admin/users",
    );

    revalidatePath(
        "/admin/roles",
    );

}



export async function setPrimaryUserRole(

    userId: string,

    roleId: string,

): Promise<void> {

    const service =
        await getService();

    await service.setPrimaryRole(
        userId,
        roleId,
    );

    revalidatePath(
        "/admin/users",
    );

    revalidatePath(
        "/admin/roles",
    );

}



export async function replaceUserRoles(

    userId: string,

    roleIds: string[],

): Promise<void> {

    const service =
        await getService();

    await service.replaceRoles(
        userId,
        roleIds,
    );

    revalidatePath(
        "/admin/users",
    );

    revalidatePath(
        "/admin/roles",
    );

}



export async function getUserRoles(
    userId: string,
) {

    const service =
        await getService();

    return service.rolesForUser(
        userId,
    );

}