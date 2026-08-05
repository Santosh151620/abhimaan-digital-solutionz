import {
    requireAuthContext,
} from "./auth-context.server";


import type {
    Role,
} from "@/types/auth/role";


import type {
    Permission,
} from "@/shared/permissions";


import {
    ROLE_HIERARCHY,
} from "./role-hierarchy";



export async function requireUser() {


    const auth =
        await requireAuthContext();



    if (!auth) {

        throw new Error(
            "Unauthorized"
        );

    }



    return auth;

}



export async function requireRole(

    minimumRole: Role,

) {


    const auth =
        await requireUser();



    const currentLevel =
        ROLE_HIERARCHY[auth.role] ?? 0;



    const requiredLevel =
        ROLE_HIERARCHY[minimumRole] ?? 0;



    if (

        currentLevel < requiredLevel

    ) {

        throw new Error(
            "Forbidden"
        );

    }



    return auth;

}



export async function requirePermission(

    permission: Permission,

) {


    const auth =
        await requireUser();



    if (

        !auth.permissions.includes(

            permission

        )

    ) {


        throw new Error(
            "Forbidden"
        );

    }



    return auth;

}