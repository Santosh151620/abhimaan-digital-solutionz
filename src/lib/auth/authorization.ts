import { PERMISSION_SET } from "@/shared/permissions";
import type {
    Permission,
} from "@/shared/permissions";

import type {
    Role,
} from "@/types/auth/role";

export interface AuthorizationProvider {

    role: Role;

    permissions: readonly Permission[];

}

export function hasPermission(

    authorization: AuthorizationProvider,

    permission: Permission,

): boolean {

    if (

        !PERMISSION_SET.has(permission)

    ) {

        return false;

    }

    return authorization.permissions.includes(permission);

}

export function hasAnyPermission(

    authorization: AuthorizationProvider,

    permissions: readonly Permission[],

): boolean {

    return permissions.some(

        permission =>

            hasPermission(

                authorization,

                permission,

            ),

    );

}

export function hasAllPermissions(

    authorization: AuthorizationProvider,

    permissions: readonly Permission[],

): boolean {

    return permissions.every(

        permission =>

            hasPermission(

                authorization,

                permission,

            ),

    );

}
