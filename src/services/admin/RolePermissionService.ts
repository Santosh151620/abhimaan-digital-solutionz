import type {
    RolePermission,
} from "@/types/admin/RolePermission";

import type {
    IRolePermissionRepository,
} from "@/repositories/admin/RolePermissionRepository";

export class RolePermissionService {

    constructor(
        private readonly repository: IRolePermissionRepository,
    ) {}



    listByRole(
        roleId: string,
    ): Promise<RolePermission[]> {

        return this.repository.listByRole(
            roleId,
        );

    }



    async assign(

        roleId: string,

        permissionId: string,

    ): Promise<void> {

        await this.repository.assign(
            roleId,
            permissionId,
        );

    }



    async revoke(

        roleId: string,

        permissionId: string,

    ): Promise<void> {

        await this.repository.revoke(
            roleId,
            permissionId,
        );

    }



    async replace(

        roleId: string,

        permissionIds: string[],

    ): Promise<void> {

        await this.repository.replace(
            roleId,
            permissionIds,
        );

    }

}