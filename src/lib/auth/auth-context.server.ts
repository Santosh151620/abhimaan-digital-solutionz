import {
    getCurrentUser,
} from "./user";

import type {
    Role,
} from "@/types/auth/role";

import {
    PERMISSIONS,
} from "@/shared/permissions";

import type {
    Permission,
} from "@/shared/permissions";


export interface AuthContext {

    userId: string;

    email: string;

    organizationId: string;

    role: Role;

    permissions: Permission[];

}


export async function getAuthContext(): Promise<AuthContext | null> {

    const user =
        await getCurrentUser();


    if (!user) {

        return null;

    }


    const roleValue =
        user.organization.role;


    /**
     * Validate the role before constructing
     * an authorization context.
     */
    const role =
        Object.prototype.hasOwnProperty.call(
            {
                PLATFORM_OWNER: true,
                PLATFORM_ADMIN: true,
                ORGANIZATION_ADMIN: true,
                DEPARTMENT_ADMIN: true,
                TEAM_LEAD: true,
                USER: true,
                VIEWER: true,
                SUPER_ADMIN: true,
                ADMIN: true,
                MANAGER: true,
            },
            roleValue,
        )
            ? roleValue as Role
            : null;


    if (!role) {

        return null;

    }


    return {

        userId:
            user.id,

        email:
            user.email,

        organizationId:
            user.organization.id,

        role,

        permissions:
            [...PERMISSIONS],

    };

}


export async function requireAuthContext(): Promise<AuthContext> {

    const context =
        await getAuthContext();


    if (!context) {

        throw new Error(
            "Unauthorized",
        );

    }


    return context;

}