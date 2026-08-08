"use server";

import { RolesRepository } from "@/repositories/admin/RolesRepository";
import { RolesService } from "@/services/admin/RolesService";
import type { Role } from "@/types/admin/Role";

async function getService(): Promise<RolesService> {
    const repository = new RolesRepository();

    return new RolesService(repository);
}

export async function getRoles(): Promise<Role[]> {
    const service = await getService();

    return service.list();
}
