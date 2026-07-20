export type PermissionAction =

    | 'view'

    | 'create'

    | 'update'

    | 'delete';



export interface Permission {


    module:string;


    action:PermissionAction;


}



export interface UserRole {


    role:string;


    permissions:Permission[];

}