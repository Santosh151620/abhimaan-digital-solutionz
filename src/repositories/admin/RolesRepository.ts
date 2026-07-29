import type { SupabaseClient } from "@supabase/supabase-js";

import { BaseRepository } from "@/lib/db/base-repository";

import type {
    Role,
} from "@/types/admin/Role";


export interface IRolesRepository {


    list(): Promise<Role[]>;


    findById(
        id:string
    ):Promise<Role | null>;

findByCode(
    code:string
):Promise<Role | null>;

    save(
        role:Role
    ):Promise<void>;


    delete(
        id:string
    ):Promise<void>;

}



export class RolesRepository
    extends BaseRepository<Role>
    implements IRolesRepository {


    constructor(
        supabase:SupabaseClient
    ){

        super(
            supabase,
            "roles"
        );

    }

async findByCode(
    code:string
):Promise<Role | null>{


    const {
        data,
        error
    } =
    await this
        .tableRef()
        .select("*")
        .eq(
            "code",
            code
        )
        .maybeSingle();



    if(error)
        throw error;



    return data as Role | null;


}

    async list():Promise<Role[]>{


        const {
            data,
            error,
        } =
        await this
            .tableRef()
            .select("*");



        if(error)
            throw error;



        return (
            data ?? []
        ) as Role[];


    }



    async findById(
        id:string
    ):Promise<Role | null>{


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



        return data as Role | null;


    }



    async save(
        role:Role
    ):Promise<void>{


        const {
            error
        } =
        await this
            .tableRef()
            .upsert(role);



        if(error)
            throw error;


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
