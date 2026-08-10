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

    ): boolean {


        const permission =
            `${module.toLowerCase()}.${action}`;



        /*
         * CRM legacy permission model.
         *
         * CRM server actions currently provide a UserRole
         * containing explicit module/action permissions through
         * CRM_ADMIN_ROLE.
         *
         * Check those permissions first so the existing CRM
         * authorization contract continues to work.
         */

        const hasExplicitPermission =
            user.permissions.some(

                item =>

                    `${item.module.toLowerCase()}.${item.action}` ===
                    permission

            );


        if (hasExplicitPermission) {

            return true;

        }



        /*
         * Enterprise role authorization.
         *
         * Roles managed by the centralized authorization system
         * continue through AuthorizationService.
         */

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