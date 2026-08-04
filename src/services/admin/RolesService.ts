import type {
    Role,
} from "@/types/admin/Role";

import type {
    IRolesRepository,
} from "@/repositories/admin/RolesRepository";

export class RolesService {

    constructor(
        private readonly repository: IRolesRepository,
    ) {}

    list(): Promise<Role[]> {

        return this.repository.list();

    }

    active(): Promise<Role[]> {

        return this.repository.active();

    }

    systemRoles(): Promise<Role[]> {

        return this.repository.systemRoles();

    }

    customRoles(): Promise<Role[]> {

        return this.repository.customRoles();

    }

    search(
        keyword: string,
    ): Promise<Role[]> {

        return this.repository.search(
            keyword,
        );

    }

    findById(
        id: string,
    ): Promise<Role | null> {

        return this.repository.findById(
            id,
        );

    }

    async existsByCode(
        code: string,
    ): Promise<boolean> {

        return this.repository.existsByCode(
            code,
        );

    }

    async existsByName(
        name: string,
    ): Promise<boolean> {

        return this.repository.existsByName(
            name,
        );

    }

    async save(
        role: Role,
    ): Promise<void> {

        if (
            role.name.trim() === ""
        ) {

            throw new Error(
                "Role name is required.",
            );

        }

        if (
            role.code.trim() === ""
        ) {

            throw new Error(
                "Role code is required.",
            );

        }

        await this.repository.save(
            role,
        );

    }

    async delete(
        id: string,
    ): Promise<void> {

        await this.repository.delete(
            id,
        );

    }

}