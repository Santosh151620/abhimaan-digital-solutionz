import type {
    Role,
} from "@/types/auth/role";


import type {
    Permission,
} from "@/shared/permissions";


import {
    ROLE_PERMISSIONS,
} from "@/shared/permissions/role-permissions";



class AuthorizationService {


    can(

        role: Role,

        permission: Permission | string,

    ): boolean {


        const permissions =
            ROLE_PERMISSIONS[role];


        return permissions.some(

            item =>

                item === permission

        );

    }



    canAny(

        role: Role,

        permissions: (Permission | string)[],

    ): boolean {


        return permissions.some(

            permission =>

                this.can(

                    role,

                    permission,

                )

        );

    }



    canAll(

        role: Role,

        permissions: (Permission | string)[],

    ): boolean {


        return permissions.every(

            permission =>

                this.can(

                    role,

                    permission,

                )

        );

    }


}



export const AuthorizationServiceInstance =
    new AuthorizationService();