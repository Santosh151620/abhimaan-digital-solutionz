import {
    requireAdmin,
} from "@/lib/requireAdmin";

import {
    requirePermission,
} from "./permission-guard";

import type {
    Permission,
} from "@/shared/permissions";


export async function requireAdminPermission(
    permission: Permission,
) {

    try {

        return await requirePermission(
            permission,
        );

    } catch {

        return await requireAdmin();

    }

}