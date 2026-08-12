export type {
    Role,
} from "@/types/auth/role";

import type {
    Role,
} from "@/types/auth/role";


export const ROLE_HIERARCHY: Record<Role, number> = {

    PLATFORM_OWNER: 100,

    PLATFORM_ADMIN: 90,

    ORGANIZATION_ADMIN: 80,

    DEPARTMENT_ADMIN: 70,

    TEAM_LEAD: 60,

    USER: 50,

    VIEWER: 10,


    // Legacy compatibility roles.
    // Retained temporarily during migration.

    SUPER_ADMIN: 100,

    ADMIN: 80,

    MANAGER: 60,

};


function getRoleLevel(
    role: string,
): number | null {

    if (
        !Object.prototype.hasOwnProperty.call(
            ROLE_HIERARCHY,
            role,
        )
    ) {

        return null;

    }


    return ROLE_HIERARCHY[
        role as Role
    ];

}