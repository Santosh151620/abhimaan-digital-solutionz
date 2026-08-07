import type {
    SupabaseClient,
} from "@supabase/supabase-js";


import {
    BaseRepository,
} from "@/lib/db/base-repository";


import type {
    Organization,
} from "@/types/admin/Organization";



export interface IOrganizationsRepository {


    list():

        Promise<Organization[]>;



    active():

        Promise<Organization[]>;



    findById(

        id: string,

    ):

        Promise<Organization | null>;



    findByCode(

        code: string,

    ):

        Promise<Organization | null>;



    save(

        organization: Organization,

    ):

        Promise<Organization>;



    delete(

        id: string,

    ):

        Promise<void>;

}




export class OrganizationsRepository

    extends BaseRepository<Organization>

    implements IOrganizationsRepository {



    constructor(

        supabase: SupabaseClient,

    ) {

        super(

            supabase,

            "organizations",

        );

    }




    async list():

        Promise<Organization[]> {


        const {

            data,

            error,

        } = await this

            .tableRef()

            .select("*")

            .order(

                "name",

                {

                    ascending: true,

                },

            );



        if (error) {

            throw error;

        }



        return (

            data ?? []

        ) as Organization[];

    }





    async active():

        Promise<Organization[]> {


        const {

            data,

            error,

        } = await this

            .tableRef()

            .select("*")

            .eq(

                "is_active",

                true,

            )

            .order(

                "name",

                {

                    ascending: true,

                },

            );



        if (error) {

            throw error;

        }



        return (

            data ?? []

        ) as Organization[];

    }





    async findById(

        id: string,

    ):

        Promise<Organization | null> {


        return super.findById(

            id,

        );

    }





    async findByCode(

        code: string,

    ):

        Promise<Organization | null> {


        const {

            data,

            error,

        } = await this

            .tableRef()

            .select("*")

            .eq(

                "code",

                code

                    .trim()

                    .toUpperCase(),

            )

            .maybeSingle();



        if (error) {

            throw error;

        }



        return (

            data as Organization

        ) ?? null;

    }





    async save(

        organization: Organization,

    ):

        Promise<Organization> {


        const {

            data,

            error,

        } = await this

            .tableRef()

            .upsert(

                organization,

            )

            .select()

            .single();



        if (error) {

            throw error;

        }



        return data as Organization;

    }





    async delete(

        id: string,

    ):

        Promise<void> {


        const {

            error,

        } = await this

            .tableRef()

            .delete()

            .eq(

                "id",

                id,

            );



        if (error) {

            throw error;

        }

    }


}