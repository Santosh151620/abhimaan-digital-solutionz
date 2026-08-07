import type {
    RolePermission,
} from "@/types/admin/RolePermission";


import type {
    IRolePermissionRepository,
} from "@/repositories/admin/RolePermissionRepository";



export class RolePermissionService {


    constructor(
        private readonly repository:
            IRolePermissionRepository,
    ) {}





    async listByRole(
        roleId:string,
    ):
    Promise<RolePermission[]> {


        this.validateId(
            roleId,
            "Role",
        );


        return this.repository.listByRole(
            roleId,
        );

    }





    async assign(
        roleId:string,
        permissionId:string,
    ):
    Promise<void> {


        this.validateId(
            roleId,
            "Role",
        );


        this.validateId(
            permissionId,
            "Permission",
        );



        const existing =
            await this.repository.listByRole(
                roleId,
            );



        const alreadyAssigned =
            existing.some(
                item =>
                    item.permissionId === permissionId,
            );



        if(alreadyAssigned) {

            return;

        }




        await this.repository.assign(
            roleId,
            permissionId,
        );


    }







    async revoke(
        roleId:string,
        permissionId:string,
    ):
    Promise<void> {


        this.validateId(
            roleId,
            "Role",
        );


        this.validateId(
            permissionId,
            "Permission",
        );



        await this.repository.revoke(
            roleId,
            permissionId,
        );


    }








    async replace(
        roleId:string,
        permissionIds:string[],
    ):
    Promise<void> {


        this.validateId(
            roleId,
            "Role",
        );



        const uniquePermissions =
            Array.from(
                new Set(
                    permissionIds
                        .filter(Boolean),
                ),
            );



        await this.repository.replace(
            roleId,
            uniquePermissions,
        );


    }








    private validateId(
        id:string,
        entity:string,
    ) {


        if(!id?.trim()) {

            throw new Error(
                `${entity} id is required.`,
            );

        }


    }


}