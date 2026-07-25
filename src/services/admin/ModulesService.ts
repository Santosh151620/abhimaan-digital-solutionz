import type {
    PlatformModule,
} from "@/types/admin/Module";

import type {
    IModulesRepository,
} from "@/repositories/admin/ModulesRepository";

export class ModulesService {

    constructor(
        private readonly repository: IModulesRepository
    ) { }

    list(): Promise<PlatformModule[]> {

        return this.repository.list();

    }

    findById(
        id: string
    ): Promise<PlatformModule | null> {

        return this.repository.findById(id);

    }

    findByCode(
        code: string
    ): Promise<PlatformModule | null> {

        return this.repository.findByCode(code);

    }

    async isEnabled(
        code: string
    ): Promise<boolean> {

        const platformModule =
            await this.repository.findByCode(code);

        return platformModule?.status === "Active";

    }

    async dependenciesSatisfied(
    platformModule: PlatformModule
): Promise<boolean> {

    if (!platformModule.dependencies.length) {

            return true;

        }

        const modules =
            await this.repository.list();

        return platformModule.dependencies.every(
            dependency =>
                modules.some(
                    item =>
                        item.code === dependency &&
                        item.status === "Active"
                )
        );

    }

    save(
        module: PlatformModule
    ): Promise<void> {

        return this.repository.save(module);

    }

    delete(
        id: string
    ): Promise<void> {

        return this.repository.delete(id);

    }

}