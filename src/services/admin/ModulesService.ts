import type {
    PlatformModule,
} from "@/types/admin/Module";


import type {
    IModulesRepository,
} from "@/repositories/admin/ModulesRepository";



export class ModulesService {



    constructor(

        private readonly repository:
            IModulesRepository,

    ) {}



    async list():

    Promise<PlatformModule[]> {


        return this.repository.list();


    }



    async findById(

        id: string,

    ):

    Promise<PlatformModule | null> {


        const normalizedId =
            this.validateId(
                id,
            );


        return this.repository.findById(

            normalizedId,

        );


    }



    async findByCode(

        code: string,

    ):

    Promise<PlatformModule | null> {


        const normalizedCode =
            this.normalizeCode(
                code,
            );


        return this.repository.findByCode(

            normalizedCode,

        );


    }



    async isEnabled(

        code: string,

    ):

    Promise<boolean> {


        const platformModule =
            await this.findByCode(

                code,

            );


        return (

            platformModule?.status ===
            "Active"

        );


    }



    async dependenciesSatisfied(

        platformModule:
            PlatformModule,

    ):

    Promise<boolean> {


        if (!platformModule) {

            throw new Error(

                "Platform module is required.",

            );

        }


        const dependencies =
            Array.isArray(
                platformModule.dependencies,
            )
                ? platformModule.dependencies
                : [];


        if (!dependencies.length) {

            return true;

        }


        const modules =
            await this.repository.list();


        return dependencies.every(

            dependency => {

                const normalizedDependency =
                    typeof dependency ===
                    "string"
                        ? dependency
                            .trim()
                            .toUpperCase()
                        : "";


                if (!normalizedDependency) {

                    return false;

                }


                return modules.some(

                    item =>

                        this.normalizeCode(
                            item.code,
                        ) ===
                            normalizedDependency &&

                        item.status ===
                            "Active",

                );

            },

        );

    }



    async save(

        module:
            PlatformModule,

    ):

    Promise<void> {


        const normalizedModule =
            this.validateModule(
                module,
            );


        const existing =
            await this.repository.findByCode(

                normalizedModule.code,

            );


        if (

            existing &&

            existing.id !==
                module.id

        ) {

            throw new Error(

                "Module code already exists.",

            );

        }


        await this.repository.save(

            {

                ...module,

                code:
                    normalizedModule.code,

                name:
                    normalizedModule.name,

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


        const existingModule =
            await this.repository.findById(

                normalizedId,

            );


        if (!existingModule) {

            throw new Error(

                "Module not found.",

            );

        }


        if (existingModule.isSystem) {

            throw new Error(

                "System modules cannot be deleted.",

            );

        }


        await this.repository.delete(

            normalizedId,

        );

    }



    private validateModule(

        module:
            PlatformModule,

    ): {

        code: string;

        name: string;

    } {


        if (!module) {

            throw new Error(

                "Platform module is required.",

            );

        }


        const code =
            this.normalizeCode(
                module.code,
            );


        const name =
            typeof module.name ===
            "string"
                ? module.name.trim()
                : "";


        if (!name) {

            throw new Error(

                "Module name is required.",

            );

        }


        if (!module.status) {

            throw new Error(

                "Module status is required.",

            );

        }


        return {

            code,

            name,

        };

    }



    private normalizeCode(

        code: string,

    ):

    string {


        const normalizedCode =
            typeof code ===
            "string"
                ? code
                    .trim()
                    .toUpperCase()
                : "";


        if (!normalizedCode) {

            throw new Error(

                "Module code is required.",

            );

        }


        return normalizedCode;

    }



    private validateId(

        id: string,

    ):

    string {


        const normalizedId =
            typeof id ===
            "string"
                ? id.trim()
                : "";


        if (!normalizedId) {

            throw new Error(

                "Module id is required.",

            );

        }


        return normalizedId;

    }

}