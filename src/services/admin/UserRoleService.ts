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
        userId:string,

    ):

    Promise<UserRole[]> {
        this.validateId(

            userId,

            "User",

        );

        return this.repository.rolesForUser(

            userId,

        );
    }
    async assignRole(
        userId:string,
        roleId:string,

    ):

    Promise<void> {
        this.validateId(
            userId,
            "User",
        );
        this.validateId(
            roleId,
            "Role",
        );

       const existing =
            await this.repository.rolesForUser(
                userId,
            );

       const alreadyAssigned =
            existing.some(
                item =>
                    item.roleId === roleId
                    && item.isActive,
            );
        if(alreadyAssigned) {
            return;
        }
        await this.repository.assignRole(
            userId,
            roleId,
        );
    }
    async removeRole(
        userId:string,
        roleId:string,
    ):

    Promise<void> {
        this.validateId(
            userId,
            "User",
        );
        this.validateId(
            roleId,
            "Role",
        );

        await this.repository.removeRole(
            userId,
            roleId,
        );
    }
    async replaceRoles(
        userId:string,
        roleIds:string[],
    ):

    Promise<void> {
        this.validateId(
            userId,
            "User",
        );
        const uniqueRoles =
            Array.from(
                new Set(
                    roleIds
                ),
            );
        await this.repository.replaceRoles(
            userId,
            uniqueRoles,
        );
    }
    async setPrimaryRole(
        userId:string,
        roleId:string,
    ):

    Promise<void> {
        this.validateId(
            userId,
            "User",
        );
        this.validateId(
            roleId,
            "Role",
        );

        const roles =
            await this.repository.rolesForUser(
                userId,
            );

        const assigned =
            roles.some(
                role =>
                    role.roleId === roleId
                    && role.isActive,
            );

        if(!assigned) {
            throw new Error(
                "Cannot set primary role before assignment."
            );
        }
        await this.repository.setPrimaryRole(
            userId,
            roleId,
        );
    }

    private validateId(
        id:string,
        entity:string,
    ) {
        if(!id?.trim()) {
            throw new Error(
                `${entity} id is required.`
            );
        }
   }
}