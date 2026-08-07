import type {
    Permission,
} from "@/types/admin/Permission";


import type {
    IPermissionsRepository,
} from "@/repositories/admin/PermissionsRepository";


export class PermissionsService {
    constructor(
        private readonly repository:
            IPermissionsRepository,
    ) {}

    async list():
    Promise<Permission[]> {
        return this.repository.list();
    }
    async active():
    Promise<Permission[]> {
        return this.repository.active();
    }

    async findById(
        id:string,
    ):

    Promise<Permission | null> {
        this.validateId(
            id,
        );
        return this.repository.findById(
            id,
        );
    }

    async findByKey(
        key:string,
    ):

    Promise<Permission | null> {
        if(!key?.trim()) {
            throw new Error(
                "Permission key is required."
            );
        }
        return this.repository.findByKey(

            key

                .trim()

                .toLowerCase(),

        );



    }









    async search(

        keyword:string,

    ):

    Promise<Permission[]> {


return this.repository.search(
    keyword.trim(),
);

    }









    async save(

        permission:Permission,

    ):

    Promise<void> {



        this.validatePermission(

            permission,

        );







        const normalizedKey =
    permission.key
        .trim()
        .toLowerCase();

const existing =
    await this.repository.findByKey(
        normalizedKey,
    );
        if(

            existing &&

            existing.id !== permission.id

        ) {



            throw new Error(

                "Permission key already exists."

            );



        }

 await this.repository.save({

    ...permission,

    key:
        permission.key
            .trim()
            .toLowerCase(),

    name:
        permission.name.trim(),

    module:
        permission.module.trim(),

    action:
        permission.action.trim(),

    updatedAt:
        new Date()
            .toISOString(),

});

    }









    async delete(

        id:string,

    ):

    Promise<void> {



        this.validateId(

            id,

        );

        const permission =
            await this.repository.findById(
                id,
            );

        if(!permission) {



            throw new Error(

                "Permission not found."

            );



        }







        if(permission.isSystem) {



            throw new Error(

                "System permissions cannot be deleted."

            );



        }







        await this.repository.delete(

            id,

        );



    }









    private validatePermission(

        permission:Permission,

    ) {



        if(!permission.key?.trim()) {



            throw new Error(

                "Permission key is required."

            );



        }

        if(!permission.name?.trim()) {



            throw new Error(

                "Permission name is required."

            );



        }

        if(!permission.module?.trim()) {
            throw new Error(
                "Permission module is required."
            );

        }
        if(!permission.action?.trim()) {
            throw new Error(
                "Permission action is required."
            );
        }
        if (!permission.type) {

    throw new Error(
        "Permission type is required.",
    );

}
    }
    private validateId(
        id:string,
    ) {
        if(!id?.trim()) {
            throw new Error(
                "Permission id is required."
            );
        }
    }
}