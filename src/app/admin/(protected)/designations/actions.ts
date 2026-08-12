"use server";

import { randomUUID } from "crypto";

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

    return new DesignationsService(

        new DesignationsRepository(
            supabase,
        ),

    );

}

export async function saveDesignation(

    designation:Partial<Designation>,

):Promise<void> {

    const service =
        await getService();

    const now =
        new Date().toISOString();

    await service.save({

        id:
            designation.id ??
            randomUUID(),

        organizationId:
            designation.organizationId ?? "",

        departmentId:
            designation.departmentId,

        designationCode:
            designation.designationCode ?? "",

        designationName:
            designation.designationName ?? "",

        description:
            designation.description,

        status:
            designation.status ?? "Active",

        metadata:
            designation.metadata ?? {},

        createdAt:
            designation.createdAt ?? now,

        updatedAt:
            now,

    });

}

async function deleteDesignation(

    id:string,

):Promise<void> {

    const service =
        await getService();

    await service.delete(
        id,
    );

}