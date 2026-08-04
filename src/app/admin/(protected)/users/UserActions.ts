"use server";

import { createClient } from "@/lib/supabase/server";

import {
    UserRoleRepository,
} from "@/repositories/admin/UserRoleRepository";

import {
    UserRoleService,
} from "@/services/admin/UserRoleService";

import type {
    UserRole,
} from "@/types/admin/UserRole";

async function getService() {

    const supabase =
        await createClient();

    return new UserRoleService(

        new UserRoleRepository(
            supabase,
        ),

    );

}

export async function getUserRoles(
    userId: string,
): Promise<UserRole[]> {

    const service =
        await getService();

    return service.rolesForUser(
        userId,
    );

}

export async function assignRole(

    userId: string,

    roleId: string,

): Promise<{
    success: boolean;
}> {

    const service =
        await getService();

    await service.assignRole(

        userId,

        roleId,

    );

    return {

        success: true,

    };

}

export async function removeRole(

    userId: string,

    roleId: string,

): Promise<{
    success: boolean;
}> {

    const service =
        await getService();

    await service.removeRole(

        userId,

        roleId,

    );

    return {

        success: true,

    };

}

export async function replaceRoles(

    userId: string,

    roleIds: string[],

): Promise<{
    success: boolean;
}> {

    const service =
        await getService();

    await service.replaceRoles(

        userId,

        roleIds,

    );

    return {

        success: true,

    };

}

export async function setPrimaryRole(

    userId: string,

    roleId: string,

): Promise<{
    success: boolean;
}> {

    const service =
        await getService();

    await service.setPrimaryRole(

        userId,

        roleId,

    );

    return {

        success: true,

    };

}