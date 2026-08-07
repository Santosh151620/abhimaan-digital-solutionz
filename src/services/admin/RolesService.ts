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
        id:string,
    ):
    Promise<Role | null> {
        this.validateId(

            id,

            "Role",

        );







        return this.repository.findById(

            id,

        );



    }









    async findByCode(

        code:string,

    ):

    Promise<Role | null> {



        if(!code?.trim()) {



            throw new Error(

                "Role code is required."

            );



        }







        return this.repository.findByCode(

            code

                .trim()

                .toLowerCase(),

        );



    }









    async save(

        role:Role,

    ):

    Promise<void> {



        this.validateRole(

            role,

        );







        const existing =

            await this.repository.findByCode(

                role.code,

            );







        if(

            existing &&

            existing.id !== role.id

        ) {



            throw new Error(

                "Role code already exists."

            );



        }







        await this.repository.save(

            {

                ...role,

                code:

                    role.code

                    .trim()

                    .toLowerCase(),

                updatedAt:

                    new Date()

                    .toISOString(),

            },

        );



    }









    async delete(

        id:string,

    ):

    Promise<void> {



        this.validateId(

            id,

            "Role",

        );







        const role =

            await this.repository.findById(

                id,

            );







        if(!role) {



            throw new Error(

                "Role not found."

            );



        }







        if(role.isSystem) {



            throw new Error(

                "System roles cannot be deleted."

            );



        }







        await this.repository.delete(

            id,

        );



    }









    private validateRole(

        role:Role,

    ) {



        if(!role.name?.trim()) {



            throw new Error(

                "Role name is required."

            );



        }







        if(!role.code?.trim()) {



            throw new Error(

                "Role code is required."

            );



        }







        if(!role.type) {



            throw new Error(

                "Role type is required."

            );



        }







        if(!role.level) {



            throw new Error(

                "Role level is required."

            );



        }



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