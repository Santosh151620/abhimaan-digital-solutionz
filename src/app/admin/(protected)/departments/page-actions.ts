"use server";

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

export async function getDepartments():
Promise<Department[]> {

    const service =
        await getService();

    return service.list();
}

async function getActiveDepartments():
Promise<Department[]> {

    const service =
        await getService();

    return service.active();
}

async function getDepartment(
    id:string,
):
Promise<Department | null> {

    const service =
        await getService();

    return service.findById(
        id,
    );
}

async function getDepartmentByCode(
    code:string,
):
Promise<Department | null> {

    const service =
        await getService();

    return service.findByCode(
        code,
    );
}