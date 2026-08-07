"use server";

import {
    revalidatePath,
} from "next/cache";

import {
    createClient,
} from "@/lib/supabase/server";

import {
    DepartmentsRepository,
} from "@/repositories/admin/DepartmentsRepository";

import {
    DepartmentsService,
} from "@/services/admin/DepartmentsService";

import type {
    Department,
} from "@/types/admin/Department";

async function getService() {

    const supabase =
        await createClient();

    const repository =
        new DepartmentsRepository(
            supabase,
        );

    return new DepartmentsService(
        repository,
    );
}

export async function saveDepartment(
    department:Department,
):Promise<void> {

    const service =
        await getService();

    await service.save(
        department,
    );

    revalidatePath(
        "/admin/departments",
    );
}

export async function deleteDepartment(
    id:string,
):Promise<void> {

    const service =
        await getService();

    await service.delete(
        id,
    );

    revalidatePath(
        "/admin/departments",
    );
}