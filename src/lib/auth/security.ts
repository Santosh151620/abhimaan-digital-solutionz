import {
    requireAuthContext,
} from "./auth-context.server";

import {
    ROLE_HIERARCHY,
} from "./role-hierarchy";

import type {
    Role,
} from "@/types/auth/role";


export async function requireSecurityContext() {

    return requireAuthContext();

}


export async function requireRoleAccess(
    minimumRole: Role = "USER",
) {

    const context =
        await requireAuthContext();

    const currentLevel =
        ROLE_HIERARCHY[context.role] ?? 0;

    const requiredLevel =
        ROLE_HIERARCHY[minimumRole] ?? 0;

    if (
        currentLevel < requiredLevel
    ) {

        throw new Error(
            "Forbidden",
        );

    }

    return context;

}


export async function requirePlatformOwner() {

    return requireRoleAccess(
        "PLATFORM_OWNER",
    );

}


export async function requirePlatformAdmin() {

    return requireRoleAccess(
        "PLATFORM_ADMIN",
    );

}


export async function requireOrganizationAdmin() {

    return requireRoleAccess(
        "ORGANIZATION_ADMIN",
    );

}


export async function requireDepartmentAdmin() {

    return requireRoleAccess(
        "DEPARTMENT_ADMIN",
    );

}


export async function requireTeamLead() {

    return requireRoleAccess(
        "TEAM_LEAD",
    );

}


export async function requireAuthenticatedUser() {

    return requireRoleAccess(
        "USER",
    );

}