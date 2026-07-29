import type { SupabaseClient } from "@supabase/supabase-js";

import { BaseRepository } from "@/lib/db/base-repository";

import type {
    Permission,
} from "@/types/admin/Permission";



export interface IPermissionsRepository {


    list():Promise<Permission[]>;


    findById(
        id:string
    ):Promise<Permission | null>;

findByKey(
    key:string
):Promise<Permission | null>;

    save(
        permission:Permission
    ):Promise<void>;



    delete(
        id:string
    ):Promise<void>;

}



export class PermissionsRepository
    extends BaseRepository<Permission>
    implements IPermissionsRepository {


    constructor(
        supabase:SupabaseClient
    ){

        super(
            supabase,
            "permissions"
        );

    }



    async list():Promise<Permission[]>{


        const {
            data,
            error
        } =
        await this
            .tableRef()
            .select("*");



        if(error)
            throw error;



        return (
            data ?? []
        ) as Permission[];


    }




    async findById(
        id:string
    ):Promise<Permission | null>{


        const {
            data,
            error
        } =
        await this
            .tableRef()
            .select("*")
            .eq(
                "id",
                id
            )
            .maybeSingle();



        if(error)
            throw error;



        return data as Permission | null;


    }




    async save(
        permission:Permission
    ):Promise<void>{


        const {
            error
        } =
        await this
            .tableRef()
            .upsert(
                permission
            );



        if(error)
            throw error;


    }

async findByKey(
    key:string
):Promise<Permission | null>{


    const {
        data,
        error
    } =
    await this
        .tableRef()
        .select("*")
        .eq(
            "key",
            key
        )
        .maybeSingle();



    if(error)
        throw error;



    return data as Permission | null;


}


    async delete(
        id:string
    ):Promise<void>{


        const {
            error
        } =
        await this
            .tableRef()
            .delete()
            .eq(
                "id",
                id
            );



        if(error)
            throw error;


    }
}
