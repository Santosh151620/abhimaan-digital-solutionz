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

        id: string,

    ):

    Promise<Permission | null> {


        const normalizedId =
            this.validateId(

                id,

            );



        return this.repository.findById(

            normalizedId,

        );


    }









    async findByKey(

        key: string,

    ):

    Promise<Permission | null> {


        const normalizedKey =
            this.normalizeKey(

                key,

            );



        return this.repository.findByKey(

            normalizedKey,

        );


    }









    async search(

        keyword: string,

    ):

    Promise<Permission[]> {


        const normalizedKeyword =
            this.normalizeSearchKeyword(

                keyword,

            );



        return this.repository.search(

            normalizedKeyword,

        );


    }









    async save(

        permission: Permission,

    ):

    Promise<void> {


        const normalizedPermission =
            this.validatePermission(

                permission,

            );



        const existing =
            await this.repository.findByKey(

                normalizedPermission.key,

            );



        if (

            existing &&

            existing.id !== permission.id

        ) {


            throw new Error(

                "Permission key already exists.",

            );


        }



        await this.repository.save(

            {

                ...permission,


                key:
                    normalizedPermission.key,


                name:
                    normalizedPermission.name,


                module:
                    normalizedPermission.module,


                action:
                    normalizedPermission.action,


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

            );



        const permission =
            await this.repository.findById(

                normalizedId,

            );



        if (!permission) {


            throw new Error(

                "Permission not found.",

            );


        }



        if (permission.isSystem) {


            throw new Error(

                "System permissions cannot be deleted.",

            );


        }



        await this.repository.delete(

            normalizedId,

        );


    }









    private validatePermission(

        permission: Permission,

    ): {

        key: string;

        name: string;

        module: string;

        action: string;

    } {


        if (!permission) {


            throw new Error(

                "Permission is required.",

            );


        }



        const key =
            this.normalizeKey(

                permission.key,

            );



        const name =
            this.normalizeRequiredText(

                permission.name,

                "Permission name is required.",

            );



        const module =
            this.normalizeRequiredText(

                permission.module,

                "Permission module is required.",

            );



        const action =
            this.normalizeRequiredText(

                permission.action,

                "Permission action is required.",

            );



        if (!permission.type) {


            throw new Error(

                "Permission type is required.",

            );


        }



        return {

            key,

            name,

            module,

            action,

        };


    }









    private normalizeKey(

        key: string,

    ): string {


        const normalizedKey =

            typeof key ===
            "string"

                ? key
                    .trim()
                    .toLowerCase()

                : "";



        if (!normalizedKey) {


            throw new Error(

                "Permission key is required.",

            );


        }



        return normalizedKey;


    }









    private normalizeSearchKeyword(

        keyword: string,

    ): string {


        return typeof keyword ===
            "string"

            ? keyword.trim()

            : "";


    }









    private normalizeRequiredText(

        value: string,

        message: string,

    ): string {


        const normalizedValue =

            typeof value ===
            "string"

                ? value.trim()

                : "";



        if (!normalizedValue) {


            throw new Error(

                message,

            );


        }



        return normalizedValue;


    }









    private validateId(

        id: string,

    ): string {


        const normalizedId =

            typeof id ===
            "string"

                ? id.trim()

                : "";



        if (!normalizedId) {


            throw new Error(

                "Permission id is required.",

            );


        }



        return normalizedId;


    }

}