import type {
    SupabaseClient,
} from "@supabase/supabase-js";


import {
    BaseRepository,
} from "@/lib/db/base-repository";


import type {
    Designation,
} from "@/types/admin/Designation";



type DesignationRow = {

    id: string;

    organization_id: string;

    department_id: string | null;

    designation_code: string;

    designation_name: string;

    description: string | null;

    status: Designation["status"];

    metadata: Record<string, unknown> | null;

    created_at: string;

    updated_at: string;

};



export interface IDesignationsRepository {

    list():
        Promise<Designation[]>;


    active():
        Promise<Designation[]>;


    findById(
        id: string,
    ):
        Promise<Designation | null>;


    findByCode(
        code: string,
    ):
        Promise<Designation | null>;


    search(
        keyword: string,
    ):
        Promise<Designation[]>;


    save(
        designation: Partial<Designation>,
    ):
        Promise<Designation>;


    delete(
        id: string,
    ):
        Promise<void>;

}



export class DesignationsRepository
    extends BaseRepository<Designation>
    implements IDesignationsRepository {



    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            "designations",
        );

    }





    async list():
        Promise<Designation[]> {


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
                    "designation_name",
                    {
                        ascending: true,
                    },
                );


        if (error) {
            throw error;
        }


        return (data ?? [])
            .map(
                row =>
                    this.mapDesignation(
                        row as DesignationRow,
                    ),
            );

    }






    async active():
        Promise<Designation[]> {


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
                    "status",
                    "Active",
                )
                .order(
                    "designation_name",
                    {
                        ascending: true,
                    },
                );


        if (error) {
            throw error;
        }


        return (data ?? [])
            .map(
                row =>
                    this.mapDesignation(
                        row as DesignationRow,
                    ),
            );

    }






    async findById(
        id: string,
    ):
        Promise<Designation | null> {


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


        if (error) {
            throw error;
        }


        return data
            ? this.mapDesignation(
                data as DesignationRow,
            )
            : null;

    }






    async findByCode(
        code: string,
    ):
        Promise<Designation | null> {


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
                    "designation_code",
                    code
                        .trim()
                        .toUpperCase(),
                )
                .maybeSingle();


        if (error) {
            throw error;
        }


        return data
            ? this.mapDesignation(
                data as DesignationRow,
            )
            : null;

    }







    async search(
        keyword: string,
    ):
        Promise<Designation[]> {


        const search =
            keyword.trim();


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
                .or(
                    [
                        `designation_name.ilike.%${search}%`,
                        `designation_code.ilike.%${search}%`,
                        `description.ilike.%${search}%`,
                    ].join(","),
                );


        if (error) {
            throw error;
        }


        return (data ?? [])
            .map(
                row =>
                    this.mapDesignation(
                        row as DesignationRow,
                    ),
            );

    }







    async save(
        designation: Partial<Designation>,
    ):
        Promise<Designation> {


        if (!designation.designationCode?.trim()) {
            throw new Error(
                "Designation code is required.",
            );
        }


        if (!designation.designationName?.trim()) {
            throw new Error(
                "Designation name is required.",
            );
        }



        const now =
            new Date()
                .toISOString();



        const {
            data,
            error,
        } =
            await this
                .tableRef()
                .upsert(
                    {

                        id:
                            designation.id,

                        organization_id:
                            this.organizationId,

                        department_id:
                            designation.departmentId ?? null,

                        designation_code:
                            designation.designationCode
                                .trim()
                                .toUpperCase(),

                        designation_name:
                            designation.designationName
                                .trim(),

                        description:
                            designation.description ?? null,

                        status:
                            designation.status ?? "Active",

                        metadata:
                            designation.metadata ?? {},

                        created_at:
                            designation.createdAt ?? now,

                        updated_at:
                            now,

                    },
                    {
                        onConflict: "id",
                    },
                )
                .select()
                .single();



        if (error) {
            throw error;
        }



        return this.mapDesignation(
            data as DesignationRow,
        );

    }







    async delete(
        id: string,
    ):
        Promise<void> {


        await super.delete(
            id,
        );

    }







    private mapDesignation(
        row: DesignationRow,
    ):
        Designation {


        return {

            id:
                row.id,


            organizationId:
                row.organization_id,


            departmentId:
                row.department_id ?? undefined,


            designationCode:
                row.designation_code,


            designationName:
                row.designation_name,


            description:
                row.description ?? undefined,


            status:
                row.status,


            metadata:
                row.metadata ?? {},


            createdAt:
                row.created_at,


            updatedAt:
                row.updated_at,

        };

    }

}