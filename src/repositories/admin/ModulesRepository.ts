/**
 * ============================================================================
 * Platform Modules Repository
 *
 * Admin Module Registry
 *
 * Architecture:
 *
 * ModuleService
 *        ↓
 * ModulesRepository
 *        ↓
 * BaseRepository
 *        ↓
 * module_registry
 *
 * ============================================================================
 */


import type {
    SupabaseClient,
} from "@supabase/supabase-js";


import {
    BaseRepository,
} from "@/lib/db/base-repository";


import {
    createSupabaseServerClient,
} from "@/lib/supabase/server-client";


import type {
    PlatformModule,
} from "@/types/admin/Module";





export interface IModulesRepository {


    list():
        Promise<PlatformModule[]>;



    findById(
        id:string,
    ):
        Promise<PlatformModule | null>;



    findByCode(
        code:string,
    ):
        Promise<PlatformModule | null>;



    save(
        module:PlatformModule,
    ):
        Promise<void>;



    delete(
        id:string,
    ):
        Promise<void>;

}





type ModuleRegistryRow = {


    id:string;


    organization_id:string;


    module_code:string;


    module_name:string;


    module_type:string | null;


    description:string | null;


    enabled:boolean | null;


    display_order:number | null;


    configuration:
        Record<string,unknown> | null;



    created_at:string;


    updated_at:string;


};







export class ModulesRepository

    extends BaseRepository<PlatformModule>

    implements IModulesRepository {





    constructor(
        supabase:SupabaseClient,
    ){

        super(
            supabase,
            "module_registry",
        );

    }






    /**
     * Factory for server components/actions
     */
    static async create():

        Promise<ModulesRepository> {


        const supabase =
            await createSupabaseServerClient();



        return new ModulesRepository(
            supabase,
        );

    }









    async list():

        Promise<PlatformModule[]> {



        const {
            data,
            error,

        } =
            await this
                .tableRef()
                .select("*")
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .order(
                    "display_order",
                    {
                        ascending:true,
                    },
                );



        if(error)
            throw error;




        return (data ?? [])
            .map(
                row =>
                    this.mapToDomain(
                        row as ModuleRegistryRow,
                    ),
            );


    }









    async findById(
        id:string,
    ):
        Promise<PlatformModule | null>{



        const {
            data,
            error,

        } =
            await this
                .tableRef()
                .select("*")
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "id",
                    id,
                )
                .maybeSingle();



        if(error)
            throw error;



        return data
            ?
                this.mapToDomain(
                    data as ModuleRegistryRow,
                )
            :
                null;


    }









    async findByCode(
        code:string,
    ):
        Promise<PlatformModule | null>{



        const normalizedCode =
            code
                .trim()
                .toUpperCase();



        const {
            data,
            error,

        } =
            await this
                .tableRef()
                .select("*")
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "module_code",
                    normalizedCode,
                )
                .maybeSingle();



        if(error)
            throw error;



        return data
            ?
                this.mapToDomain(
                    data as ModuleRegistryRow,
                )
            :
                null;


    }









    async save(
        module:PlatformModule,
    ):
        Promise<void>{



        const now =
            new Date()
                .toISOString();



        const {
            error,

        } =
            await this
                .tableRef()
                .upsert(

                    {


                        id:
                            module.id,


                        organization_id:
                            this.organizationId,


                        module_code:
                            module.code
                                .trim()
                                .toUpperCase(),


                        module_name:
                            module.name
                                .trim(),


                        module_type:
                            module.category,


                        description:
                            module.description
                            ??
                            null,


                        enabled:
                            module.status === "Active",


                        display_order:
                            module.displayOrder
                            ??
                            0,


                        configuration:
                            module.metadata
                            ??
                            {},


                        created_at:
                            module.createdAt
                            ??
                            now,


                        updated_at:
                            now,


                    },

                    {
                        onConflict:"id",
                    },

                );



        if(error)
            throw error;


    }









    async delete(
        id:string,
    ):
        Promise<void>{



        const {
            error,

        } =
            await this
                .tableRef()
                .delete()
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "id",
                    id,
                );



        if(error)
            throw error;


    }









    private mapToDomain(
        row:ModuleRegistryRow,
    ):
        PlatformModule {



        return {


            id:
                row.id,


            code:
                row.module_code,


            name:
                row.module_name,


            description:
                row.description
                ??
                undefined,


            category:
                this.resolveCategory(
                    row.module_type,
                ),


            version:
                "1.0",


            deploymentType:
                "Core",


            route:
                "",


            displayOrder:
                row.display_order
                ??
                0,


            dependencies:
                [],


            featureFlags:
                [],


            enabledByDefault:
                true,


            tenantConfigurable:
                false,


            licenseRequired:
                false,


            supportsCRM:
                false,


            supportsERP:
                false,


            supportsStandalone:
                true,


            supportsEnterprise:
                true,


            status:
                row.enabled
                ?
                    "Active"
                :
                    "Inactive",


            isSystem:
                true,


            metadata:
                row.configuration
                ??
                {},


            createdAt:
                row.created_at,


            updatedAt:
                row.updated_at,


        };


    }









    private resolveCategory(
        type:string | null,
    ):
        PlatformModule["category"] {



        switch(
            type?.toUpperCase()
        ){


            case "CRM":
                return "CRM";


            case "ERP":
                return "ERP";


            case "AI":
                return "AI";


            case "INTEGRATION":
                return "Integration";


            case "REPORTING":
                return "Reporting";


            case "ADMIN":
            case "ADMINISTRATION":
                return "Administration";


            default:
                return "Platform";

        }

    }


}