import {

    PERMISSIONS,

} from "@/shared/permissions";


import type {

    Permission,

} from "@/shared/permissions";


export interface PermissionAssignment {

    role: string;

    permission: Permission;

}



class PermissionRepository {


    async getAll(): Promise<readonly Permission[]> {

        return PERMISSIONS;

    }



    async assign(

        assignment: PermissionAssignment,

    ): Promise<PermissionAssignment> {

        return assignment;

    }



    async remove(

        assignment: PermissionAssignment,

    ): Promise<PermissionAssignment> {

        return assignment;

    }


}



export const PermissionRepositoryInstance =
    new PermissionRepository();
