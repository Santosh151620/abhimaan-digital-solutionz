import type {
    UserRole,
} from "@/types/admin/UserRole";


import type {
    IUserRoleRepository,
} from "@/repositories/admin/UserRoleRepository";


export class UserRoleService {


    constructor(

        private readonly repository:
            IUserRoleRepository,

    ) {}




    async rolesForUser(

        userId: string,

    ):

    Promise<UserRole[]> {

        const normalizedUserId =
            this.validateId(
                userId,
                "User",
            );


        return this.repository.rolesForUser(

            normalizedUserId,

        );

    }




    async assignRole(

        userId: string,

        roleId: string,

    ):

    Promise<void> {

        const normalizedUserId =
            this.validateId(
                userId,
                "User",
            );


        const normalizedRoleId =
            this.validateId(
                roleId,
                "Role",
            );


        const existing =
            await this.repository.rolesForUser(

                normalizedUserId,

            );


        const alreadyAssigned =
            existing.some(

                item =>

                    item.roleId ===
                        normalizedRoleId &&

                    item.isActive,

            );


        if (alreadyAssigned) {

            return;

        }


        await this.repository.assignRole(

            normalizedUserId,

            normalizedRoleId,

        );

    }




    async removeRole(

        userId: string,

        roleId: string,

    ):

    Promise<void> {

        const normalizedUserId =
            this.validateId(
                userId,
                "User",
            );


        const normalizedRoleId =
            this.validateId(
                roleId,
                "Role",
            );


        await this.repository.removeRole(

            normalizedUserId,

            normalizedRoleId,

        );

    }




    async replaceRoles(

        userId: string,

        roleIds: string[],

    ):

    Promise<void> {

        const normalizedUserId =
            this.validateId(
                userId,
                "User",
            );


        if (!Array.isArray(roleIds)) {

            throw new Error(
                "Role ids are required.",
            );

        }


        const uniqueRoles =
            Array.from(

                new Set(

                    roleIds

                        .filter(
                            (
                                roleId,
                            ): roleId is string =>
                                typeof roleId ===
                                "string",
                        )

                        .map(
                            roleId =>
                                roleId.trim(),
                        )

                        .filter(
                            Boolean,
                        ),

                ),

            );


        await this.repository.replaceRoles(

            normalizedUserId,

            uniqueRoles,

        );

    }




    async setPrimaryRole(

        userId: string,

        roleId: string,

    ):

    Promise<void> {

        const normalizedUserId =
            this.validateId(
                userId,
                "User",
            );


        const normalizedRoleId =
            this.validateId(
                roleId,
                "Role",
            );


        const roles =
            await this.repository.rolesForUser(

                normalizedUserId,

            );


        const assigned =
            roles.some(

                role =>

                    role.roleId ===
                        normalizedRoleId &&

                    role.isActive,

            );


        if (!assigned) {

            throw new Error(
                "Cannot set primary role before assignment.",
            );

        }


        await this.repository.setPrimaryRole(

            normalizedUserId,

            normalizedRoleId,

        );

    }




    private validateId(

        id: string,

        entity: string,

    ): string {

        const normalizedId =
            typeof id === "string"
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