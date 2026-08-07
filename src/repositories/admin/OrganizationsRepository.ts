import type {
    SupabaseClient,
} from "@supabase/supabase-js";


import {
    BaseRepository,
} from "@/lib/db/base-repository";


import type {
    Organization,
} from "@/types/admin/Organization";



type OrganizationRow = {

    id: string;

    name: string;

    code: string;

    description: string | null;

    type: string | null;

    status: string | null;

    is_system: boolean | null;

    is_active: boolean | null;

    created_at: string;

    updated_at: string;

};




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



        if (error)
            throw error;



        return (data ?? [])

            .map(
                row =>
                    this.mapOrganization(
                        row as OrganizationRow,
                    ),
            );

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



        if (error)
            throw error;



        return (data ?? [])

            .map(
                row =>
                    this.mapOrganization(
                        row as OrganizationRow,
                    ),
            );

    }





    async findById(
        id: string,
    ):
        Promise<Organization | null> {


        const {
            data,
            error,

        } = await this

            .tableRef()

            .select("*")

            .eq(
                "id",
                id,
            )

            .maybeSingle();



        if (error)
            throw error;



        return data

            ? this.mapOrganization(
                data as OrganizationRow,
            )

            : null;

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



        if (error)
            throw error;



        return data

            ? this.mapOrganization(
                data as OrganizationRow,
            )

            : null;

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

                {

                    id:
                        organization.id,

                    name:
                        organization.name,

                    code:
                        organization.code,

                    description:
                        organization.description,

                    type:
                        organization.type,

                    status:
                        organization.status,

                    is_system:
                        organization.isSystem,

                    is_active:
                        organization.isActive,

                    created_at:
                        organization.createdAt,

                    updated_at:
                        organization.updatedAt,

                },

                {
                    onConflict: "id",
                },

            )

            .select()

            .single();



        if (error)
            throw error;



        return this.mapOrganization(
            data as OrganizationRow,
        );

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



        if (error)
            throw error;

    }





    private mapOrganization(
        row: OrganizationRow,
    ):
        Organization {


        return {

            id:
                row.id,


            name:
                row.name,


            code:
                row.code,


            description:
                row.description ?? "",


            type:
                (row.type ?? "Customer") as Organization["type"],

            status:
                (row.status ?? "Active") as Organization["status"],


            isSystem:
                row.is_system ?? false,


            isActive:
                row.is_active ?? false,


            createdAt:
                row.created_at,


            updatedAt:
                row.updated_at,

        };

    }


}