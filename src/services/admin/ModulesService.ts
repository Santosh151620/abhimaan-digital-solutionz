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

        id:string,

    ):

    Promise<PlatformModule | null> {


        this.validateId(

            id,

        );


        return this.repository.findById(

            id,

        );


    }







    async findByCode(

        code:string,

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

        code:string,

    ):

    Promise<boolean> {


        const platformModule =

            await this.findByCode(

                code,

            );



        return (

            platformModule?.status === "Active"

        );


    }







    async dependenciesSatisfied(

        platformModule:PlatformModule,

    ):

    Promise<boolean> {



        if(

            !platformModule.dependencies.length

        ) {


            return true;


        }





        const modules =

            await this.repository.list();





        return platformModule.dependencies.every(

            dependency =>

                modules.some(

                    item =>

                        item.code === dependency &&

                        item.status === "Active",

                ),

        );


    }







    async save(

        module:PlatformModule,

    ):

    Promise<void> {


        this.validateModule(

            module,

        );



        const existing =

            await this.repository.findByCode(

                this.normalizeCode(

                    module.code,

                ),

            );



        if(

            existing &&

            existing.id !== module.id

        ) {


            throw new Error(

                "Module code already exists.",

            );


        }



        await this.repository.save(

            {

                ...module,


                code:

                    this.normalizeCode(

                        module.code,

                    ),


                name:

                    module.name.trim(),



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

        );

        const module =
            await this.repository.findById(
                id,
            );

        if(!module) {
            throw new Error(
                "Module not found.",
            );
        }

        if(module.isSystem) {
            throw new Error(
                "System modules cannot be deleted.",
            );
        }

        await this.repository.delete(
            id,

        );
    }

    private validateModule(
        module:PlatformModule,

    ) {

        if(!module.code?.trim()) {
            throw new Error(
                "Module code is required.",
            );
        }
        if(!module.name?.trim()) {
            throw new Error(
                "Module name is required.",
            );
        }

        if(!module.status) {
            throw new Error(
                "Module status is required.",
            );
        }
    }
    private normalizeCode(
        code:string,
    ):

    string {
        if(!code?.trim()) {
            throw new Error(
                "Module code is required.",
            );
        }
        return code
            .trim()
            .toUpperCase();
    }
    private validateId(
        id:string,

    ) {
        if(!id?.trim()) {
            throw new Error(
                "Module id is required.",
            );
        }
    }
}