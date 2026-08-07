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

export async function createPermission(

    data: Partial<Permission>,

) {

    const service =
        await getService();

    const now =
        new Date()
            .toISOString();

    const permission: Permission = {

        id:
            data.id ??
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
            data.isSystem ?? false,

        isActive:
            data.isActive ?? true,

        metadata:
            data.metadata ?? {},

        createdAt:
            data.createdAt ??
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

        success: true,

        id:
            permission.id,

    };

}

export async function updatePermission(

    permission: Permission,

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

    revalidatePath(
        "/admin/permissions",
    );

    return {

        success: true,

    };

}

export async function deletePermission(

    id: string,

) {

    if (!id.trim()) {

        throw new Error(
            "Permission ID is required.",
        );

    }

    const service =
        await getService();

    await service.delete(
        id,
    );

    revalidatePath(
        "/admin/permissions",
    );

    return {

        success: true,

    };

}