import {
    requireAuthContext,
} from "./auth-context.server";


import type {
    Permission,
} from "@/shared/permissions";


export async function requirePermission(
    permission: Permission,
) {

    const context =
        await requireAuthContext();


    if (
        !context.permissions.includes(permission)
    ) {

        throw new Error(
            "Permission denied",
        );

    }


    return context;

}