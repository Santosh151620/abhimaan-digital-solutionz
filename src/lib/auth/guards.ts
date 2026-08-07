import type { AuthUser } from "./user";

import {
    requireUser,
} from "./user";

import type {
    Role,
} from "@/types/auth/role";

import {
    ROLE_HIERARCHY,
} from "./role-hierarchy";


export async function requireAuthenticated(): Promise<AuthUser> {
    return requireUser();
}


export async function requireOrganization(): Promise<AuthUser> {
    return requireUser();
}


export async function requireRole(
    roles: readonly Role[],
): Promise<AuthUser> {

    const user =
        await requireUser();

    if (
        !roles.includes(
            user.organization.role as Role,
        )
    ) {
        throw new Error("Forbidden");
    }

    return user;
}


export async function requireMinimumRole(
    minimumRole: Role,
): Promise<AuthUser> {

    const user =
        await requireUser();

    const currentRole =
        user.organization.role as Role;

    const currentLevel =
        ROLE_HIERARCHY[currentRole] ?? 0;

    const requiredLevel =
        ROLE_HIERARCHY[minimumRole] ?? 0;

    if (
        currentLevel < requiredLevel
    ) {
        throw new Error("Forbidden");
    }

    return user;
}


export async function requireOwner(): Promise<AuthUser> {
    return requireMinimumRole(
        "PLATFORM_OWNER",
    );
}


export async function requireAdmin(): Promise<AuthUser> {
    return requireMinimumRole(
        "ORGANIZATION_ADMIN",
    );
}


export async function requireManager(): Promise<AuthUser> {
    return requireMinimumRole(
        "TEAM_LEAD",
    );
}


export async function requireEmployee(): Promise<AuthUser> {
    return requireMinimumRole(
        "USER",
    );
}