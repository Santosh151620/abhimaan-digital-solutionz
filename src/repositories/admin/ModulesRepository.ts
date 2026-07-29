import type { PlatformModule } from "@/types/admin/Module";


export interface IModulesRepository {


    list(): Promise<PlatformModule[]>;


    findById(
        id:string
    ):Promise<PlatformModule | null>;



    findByCode(
        code:string
    ):Promise<PlatformModule | null>;



    save(
        module:PlatformModule
    ):Promise<void>;



    delete(
        id:string
    ):Promise<void>;

}



export class ModulesRepository
    implements IModulesRepository {


    private modules:PlatformModule[] = [];



    async list():Promise<PlatformModule[]> {

        return this.modules;

    }



    async findById(
        id:string
    ):Promise<PlatformModule | null>{


        return (
            this.modules.find(
                item =>
                    item.id === id
            ) ?? null
        );


    }



    async findByCode(
        code:string
    ):Promise<PlatformModule | null>{


        return (
            this.modules.find(
                item =>
                    item.code === code
            ) ?? null
        );


    }



    async save(
        module:PlatformModule
    ):Promise<void>{


        const index =
            this.modules.findIndex(
                item =>
                    item.id === module.id
            );


        if(index >= 0){

            this.modules[index] = module;

        }
        else {

            this.modules.push(module);

        }


    }



    async delete(
        id:string
    ):Promise<void>{


        this.modules =
            this.modules.filter(
                item =>
                    item.id !== id
            );


    }


}
