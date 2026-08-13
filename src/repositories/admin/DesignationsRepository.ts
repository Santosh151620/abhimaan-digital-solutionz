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

    status:
        Designation["status"] |
        null;

    metadata:
        Record<string, unknown> |
        null;

    created_at: string;

    updated_at: string;

};


export interface IDesignationsRepository {

    list(): Promise<Designation[]>;

    active(): Promise<Designation[]>;

    findById(
        id: string,
    ): Promise<Designation | null>;

    findByCode(
        code: string,
    ): Promise<Designation | null>;

    search(
        keyword: string,
    ): Promise<Designation[]>;

    save(
        designation: Partial<Designation>,
    ): Promise<Designation>;

    delete(
        id: string,
    ): Promise<void>;

}


export class DesignationsRepository
    extends BaseRepository<Designation>
    implements IDesignationsRepository
{

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
        } = await this

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


        return (data ?? []).map(
            (row) =>
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
        } = await this

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


        return (data ?? []).map(
            (row) =>
                this.mapDesignation(
                    row as DesignationRow,
                ),
        );

    }


    async findById(

        id: string,

    ):

    Promise<Designation | null> {

        const normalizedId =
            this.normalizeId(
                id,
            );


        const {
            data,
            error,
        } = await this

            .tableRef()

            .select("*")

            .eq(
                "organization_id",
                this.organizationId,
            )

            .eq(
                "id",
                normalizedId,
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

        const normalizedCode =
            this.normalizeCode(
                code,
            );


        const {
            data,
            error,
        } = await this

            .tableRef()

            .select("*")

            .eq(
                "organization_id",
                this.organizationId,
            )

            .eq(
                "designation_code",
                normalizedCode,
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
            typeof keyword === "string"
                ? keyword.trim()
                : "";


        if (!search) {

            return this.list();

        }


        const escapedSearch =
            search
                .replace(
                    /\\/g,
                    "\\\\",
                )
                .replace(
                    /%/g,
                    "\\%",
                )
                .replace(
                    /_/g,
                    "\\_",
                )
                .replace(
                    /,/g,
                    "\\,",
                )
                .replace(
                    /\./g,
                    "\\.",
                );


        const {
            data,
            error,
        } = await this

            .tableRef()

            .select("*")

            .eq(
                "organization_id",
                this.organizationId,
            )

            .or(
                [
                    `designation_name.ilike.%${escapedSearch}%`,
                    `designation_code.ilike.%${escapedSearch}%`,
                    `description.ilike.%${escapedSearch}%`,
                ].join(","),
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


        return (data ?? []).map(
            (row) =>
                this.mapDesignation(
                    row as DesignationRow,
                ),
        );

    }


    async save(

        designation:
            Partial<Designation>,

    ):

    Promise<Designation> {

        if (!designation) {

            throw new Error(
                "Designation is required.",
            );

        }


        const designationCode =
            this.normalizeCode(
                designation.designationCode,
            );


        const designationName =
            this.normalizeName(
                designation.designationName,
            );


        const now =
            new Date().toISOString();


        const payload: Record<
            string,
            unknown
        > = {

            organization_id:
                this.organizationId,

            department_id:
                this.normalizeOptionalId(
                    designation.departmentId,
                ),

            designation_code:
                designationCode,

            designation_name:
                designationName,

            description:
                this.normalizeDescription(
                    designation.description,
                ),

            status:
                designation.status ??
                "Active",

            metadata:
                designation.metadata ??
                {},

            updated_at:
                now,

        };


        if (designation.id) {

            payload.id =
                this.normalizeId(
                    designation.id,
                );


            if (designation.createdAt) {

                payload.created_at =
                    designation.createdAt;

            }

        } else {

            payload.created_at =
                now;

        }


        const {
            data,
            error,
        } = await this

            .tableRef()

            .upsert(
                payload,
                {
                    onConflict: "id",
                },
            )

            .select("*")

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

        const normalizedId =
            this.normalizeId(
                id,
            );


        await super.delete(
            normalizedId,
        );

    }


    private normalizeId(

        id: string,

    ): string {

        const normalized =
            typeof id === "string"
                ? id.trim()
                : "";


        if (!normalized) {

            throw new Error(
                "Designation id is required.",
            );

        }


        return normalized;

    }


    private normalizeCode(

        code: string | undefined,

    ): string {

        const normalized =
            typeof code === "string"
                ? code.trim().toUpperCase()
                : "";


        if (!normalized) {

            throw new Error(
                "Designation code is required.",
            );

        }


        return normalized;

    }


    private normalizeName(

        name: string | undefined,

    ): string {

        const normalized =
            typeof name === "string"
                ? name.trim()
                : "";


        if (!normalized) {

            throw new Error(
                "Designation name is required.",
            );

        }


        return normalized;

    }


    private normalizeOptionalId(

        id: string | null | undefined,

    ): string | null {

        if (
            typeof id !== "string"
        ) {

            return null;

        }


        const normalized =
            id.trim();


        return normalized || null;

    }


    private normalizeDescription(

        description:
            string | null | undefined,

    ): string | null {

        if (
            typeof description !==
            "string"
        ) {

            return null;

        }


        const normalized =
            description.trim();


        return normalized || null;

    }


    private mapDesignation(

        row: DesignationRow,

    ): Designation {

        return {

            id:
                row.id,

            organizationId:
                row.organization_id,

            departmentId:
                row.department_id ??
                undefined,

            designationCode:
                row.designation_code,

            designationName:
                row.designation_name,

            description:
                row.description ??
                undefined,

            status:
                row.status ??
                "Active",

            metadata:
                row.metadata ??
                {},

            createdAt:
                row.created_at,

            updatedAt:
                row.updated_at,

        };

    }

}