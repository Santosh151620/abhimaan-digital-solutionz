import type {
    PermissionAction,
    UserRole,
} from '@/types/crm/Permission';



class PermissionService {



    hasPermission(

        user:UserRole,

        module:string,

        action:PermissionAction,

    ) {


        return user.permissions.some(

            permission =>

                permission.module === module

                &&

                permission.action === action

        );


    }





    canView(
        user:UserRole,
        module:string
    ) {


        return this.hasPermission(

            user,

            module,

            'view'

        );


    }




    canCreate(
        user:UserRole,
        module:string
    ) {


        return this.hasPermission(

            user,

            module,

            'create'

        );


    }




    canUpdate(
        user:UserRole,
        module:string
    ) {


        return this.hasPermission(

            user,

            module,

            'update'

        );


    }




    canDelete(
        user:UserRole,
        module:string
    ) {


        return this.hasPermission(

            user,

            module,

            'delete'

        );


    }



}



export const
    PermissionServiceInstance =
        new PermissionService();