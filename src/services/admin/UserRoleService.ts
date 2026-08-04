import type {
    UserRole,
} from "@/types/admin/UserRole";

import type {
    IUserRoleRepository,
} from "@/repositories/admin/UserRoleRepository";



export class UserRoleService {

    constructor(
        private readonly repository: IUserRoleRepository,
    ) {}



    rolesForUser(
        userId: string,
    ): Promise<UserRole[]> {

        return this.repository.rolesForUser(
            userId,
        );

    }



    async assignRole(

        userId: string,

        roleId: string,

    ): Promise<void> {

        await this.repository.assignRole(
            userId,
            roleId,
        );

    }



    async removeRole(

        userId: string,

        roleId: string,

    ): Promise<void> {

        await this.repository.removeRole(
            userId,
            roleId,
        );

    }



    async replaceRoles(

        userId: string,

        roleIds: string[],

    ): Promise<void> {

        await this.repository.replaceRoles(
            userId,
            roleIds,
        );

    }



    async setPrimaryRole(

        userId: string,

        roleId: string,

    ): Promise<void> {

        await this.repository.setPrimaryRole(
            userId,
            roleId,
        );

    }

}