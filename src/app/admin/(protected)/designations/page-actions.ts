"use server";

import {
    createClient,
} from "@/lib/supabase/server";

import {
    DesignationsRepository,
} from "@/repositories/admin/DesignationsRepository";

import {
    DesignationsService,
} from "@/services/admin/DesignationsService";

import type {
    Designation,
} from "@/types/admin/Designation";

async function getService() {

    const supabase =
        await createClient();

    const repository =
        new DesignationsRepository(
            supabase,
        );

    return new DesignationsService(
        repository,
    );

}

export async function getDesignations():
Promise<Designation[]> {

    const service =
        await getService();

    return await service.list();

}

export async function getActiveDesignations():
Promise<Designation[]> {

    const service =
        await getService();

    return await service.active();

}

export async function getDesignation(
    id:string,
):
Promise<Designation | null> {

    const service =
        await getService();

    return await service.findById(
        id,
    );

}

export async function searchDesignations(
    keyword:string,
):
Promise<Designation[]> {

    const service =
        await getService();

    return await service.search(
        keyword,
    );

}