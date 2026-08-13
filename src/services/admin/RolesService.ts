import type {
    Role,
} from "@/types/admin/Role";


import type {
    IRolesRepository,
} from "@/repositories/admin/RolesRepository";



export class RolesService {


    constructor(

        private readonly repository:
            IRolesRepository,

    ) {}



    async list():

    Promise<Role[]> {

        return this.repository.list();

    }



    async active():

    Promise<Role[]> {

        return this.repository.active();

    }



    async findById(

        id: string,

    ):

    Promise<Role | null> {

        const normalizedId =
            this.validateId(

                id,

                "Role",

            );


        return this.repository.findById(

            normalizedId,

        );

    }



    async findByCode(

        code: string,

    ):

    Promise<Role | null> {

        const normalizedCode =
            this.normalizeCode(

                code,

            );


        return this.repository.findByCode(

            normalizedCode,

        );

    }



    async save(

        role: Role,

    ): Promise<Role> {

        this.validateRole(

            role,

        );


        const normalizedCode =
            this.normalizeCode(

                role.code,

            );


        const existing =
            await this.repository.findByCode(

                normalizedCode,

            );


        if (

            existing &&

            existing.id !== role.id

        ) {

            throw new Error(

                "Role code already exists.",

            );

        }


        return this.repository.save(

            {

                ...role,

                name:
                    role.name.trim(),

                code:
                    normalizedCode,

                description:
                    role.description?.trim()
                    || undefined,

                updatedAt:
                    new Date()
                        .toISOString(),

            },

        );

    }



    async delete(

        id: string,

    ):

    Promise<void> {

        const normalizedId =
            this.validateId(

                id,

                "Role",

            );


        const role =
            await this.repository.findById(

                normalizedId,

            );


        if (!role) {

            throw new Error(

                "Role not found.",

            );

        }


        if (role.isSystem) {

            throw new Error(

                "System roles cannot be deleted.",

            );

        }


        await this.repository.delete(

            normalizedId,

        );

    }



    private validateRole(

        role: Role,

    ): void {

        if (!role) {

            throw new Error(

                "Role is required.",

            );

        }


        if (!role.name?.trim()) {

            throw new Error(

                "Role name is required.",

            );

        }


        this.normalizeCode(

            role.code,

        );


        if (!role.type) {

            throw new Error(

                "Role type is required.",

            );

        }


        if (!role.level) {

            throw new Error(

                "Role level is required.",

            );

        }


        if (!role.status) {

            throw new Error(

                "Role status is required.",

            );

        }

    }



    private normalizeCode(

        code: string,

    ): string {

        const normalized =
            code?.trim().toLowerCase();


        if (!normalized) {

            throw new Error(

                "Role code is required.",

            );

        }


        if (

            !/^[a-z0-9_-]+$/.test(

                normalized,

            )

        ) {

            throw new Error(

                "Role code may contain only lowercase letters, numbers, underscores, and hyphens.",

            );

        }


        return normalized;

    }



    private validateId(

        id: string,

        entity: string,

    ): string {

        const normalized =
            id?.trim();


        if (!normalized) {

            throw new Error(

                `${entity} id is required.`,

            );

        }


        return normalized;

    }



}

