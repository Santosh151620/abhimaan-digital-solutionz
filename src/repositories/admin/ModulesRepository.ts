import type {
    PlatformModule,
} from "@/types/admin/Module";

export interface IModulesRepository {

    list(): Promise<PlatformModule[]>;

    findById(
        id: string
    ): Promise<PlatformModule | null>;

    findByCode(
        code: string
    ): Promise<PlatformModule | null>;

    save(
        module: PlatformModule
    ): Promise<void>;

    delete(
        id: string
    ): Promise<void>;

}

export interface TenantModule {

    organizationId: string;

    moduleCode: string;

    enabled: boolean;

    licensed: boolean;

    configuredAt: string;

}