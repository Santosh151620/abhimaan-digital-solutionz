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

        roleId: string,

    ):

    Promise<RolePermission[]> {


        const normalizedRoleId =
            this.validateId(

                roleId,

                "Role",

            );



        return this.repository.listByRole(

            normalizedRoleId,

        );


    }









    async assign(

        roleId: string,

        permissionId: string,

    ):

    Promise<void> {


        const normalizedRoleId =
            this.validateId(

                roleId,

                "Role",

            );



        const normalizedPermissionId =
            this.validateId(

                permissionId,

                "Permission",

            );



        const existing =
            await this.repository.listByRole(

                normalizedRoleId,

            );



        const alreadyAssigned =
            existing.some(

                item =>

                    item.permissionId ===
                    normalizedPermissionId,

            );



        if (alreadyAssigned) {


            return;


        }



        await this.repository.assign(

            normalizedRoleId,

            normalizedPermissionId,

        );


    }









    async revoke(

        roleId: string,

        permissionId: string,

    ):

    Promise<void> {


        const normalizedRoleId =
            this.validateId(

                roleId,

                "Role",

            );



        const normalizedPermissionId =
            this.validateId(

                permissionId,

                "Permission",

            );



        await this.repository.revoke(

            normalizedRoleId,

            normalizedPermissionId,

        );


    }









    async replace(

        roleId: string,

        permissionIds: string[],

    ):

    Promise<void> {


        const normalizedRoleId =
            this.validateId(

                roleId,

                "Role",

            );



        if (!Array.isArray(permissionIds)) {


            throw new Error(

                "Permission ids are required.",

            );


        }



        const uniquePermissions =
            Array.from(

                new Set(

                    permissionIds

                        .filter(

                            (
                                permissionId,
                            ): permissionId is string =>

                                typeof permissionId ===
                                "string" &&

                                Boolean(
                                    permissionId.trim(),
                                ),

                        )

                        .map(

                            permissionId =>

                                permissionId.trim(),

                        ),

                ),

            );



        await this.repository.replace(

            normalizedRoleId,

            uniquePermissions,

        );


    }









    private validateId(

        id: string,

        entity: string,

    ): string {


        const normalizedId =

            typeof id ===
            "string"

                ? id.trim()

                : "";



        if (!normalizedId) {


            throw new Error(

                `${entity} id is required.`,

            );


        }



        return normalizedId;


    }


}