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



export async function getAuthContext():


Promise<AuthContext | null> {


    const user =
        await getCurrentUser();



    if (!user) {

        return null;

    }



    const role =
        user.organization.role as Role;



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
export async function requireAuthContext():

Promise<AuthContext> {


    const context =
        await getAuthContext();



    if (!context) {

        throw new Error(
            "Unauthorized"
        );

    }



    return context;

}