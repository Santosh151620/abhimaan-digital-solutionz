import type {
    PermissionAction,
    UserRole,
} from "@/types/crm/Permission";


import {
    AuthorizationServiceInstance,
} from "@/services/auth/AuthorizationService";


import type {
    Role,
} from "@/types/auth/role";



class PermissionService {


    hasPermission(

        user: UserRole,

        module: string,

        action: PermissionAction,

    ) {


        const permission =
            `${module.toLowerCase()}.${action}`;



        return AuthorizationServiceInstance.can(

            user.role as Role,

            permission,

        );

    }




    canView(

        user: UserRole,

        module: string,

    ) {


        return this.hasPermission(

            user,

            module,

            "view",

        );

    }




    canCreate(

        user: UserRole,

        module: string,

    ) {


        return this.hasPermission(

            user,

            module,

            "create",

        );

    }




    canUpdate(

        user: UserRole,

        module: string,

    ) {


        return this.hasPermission(

            user,

            module,

            "update",

        );

    }




    canDelete(

        user: UserRole,

        module: string,

    ) {


        return this.hasPermission(

            user,

            module,

            "delete",

        );

    }


}



export const PermissionServiceInstance =
    new PermissionService();