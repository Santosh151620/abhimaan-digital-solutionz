import type {
    SupabaseClient,
} from "@supabase/supabase-js";

import {
    BaseRepository,
} from "@/lib/db/base-repository";

import type {
    Branch,
} from "@/types/admin/Branch";


type BranchRow = {

    id: string;

    organization_id: string;

    location_id: string | null;

    branch_code: string;

    branch_name: string;

    description: string | null;

    address_line1: string | null;

    address_line2: string | null;

    city: string | null;

    state: string | null;

    country: string | null;

    postal_code: string | null;

    phone: string | null;

    email: string | null;

    status:
        Branch["status"] |
        null;

    metadata:
        Record<string, unknown> |
        null;

    created_at: string;

    updated_at: string;

};


interface IBranchesRepository {

    findAll():
        Promise<Branch[]>;


    findById(
        id: string,
    ):
        Promise<Branch | null>;


    findByCode(
        code: string,
    ):
        Promise<Branch | null>;


    save(
        branch: Partial<Branch>,
    ):
        Promise<Branch>;


    delete(
        id: string,
    ):
        Promise<void>;

}



export class BranchesRepository

    extends BaseRepository<Branch>

    implements IBranchesRepository {


    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            "branches",
        );

    }




    async findAll():
        Promise<Branch[]> {


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
                "branch_name",
                {
                    ascending: true,
                },
            );


        if (error) {

            throw error;

        }


        return (data ?? []).map(
            row =>
                this.mapBranch(
                    row as BranchRow,
                ),
        );

    }





    async findById(
        id: string,
    ):
        Promise<Branch | null> {


        const normalizedId =
            this.requireValue(
                id,
                "Branch id",
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

            ? this.mapBranch(
                data as BranchRow,
            )

            : null;

    }





    async findByCode(
        code: string,
    ):
        Promise<Branch | null> {


        const normalizedCode =
            this.requireValue(
                code,
                "Branch code",
            )
            .toUpperCase();


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
                "branch_code",
                normalizedCode,
            )

            .maybeSingle();


        if (error) {

            throw error;

        }


        return data

            ? this.mapBranch(
                data as BranchRow,
            )

            : null;

    }





    async save(
        branch: Partial<Branch>,
    ):
        Promise<Branch> {


        if (!branch) {

            throw new Error(
                "Branch is required.",
            );

        }


        const branchCode =
            this.requireValue(
                branch.branchCode,
                "Branch code",
            )
            .toUpperCase();


        const branchName =
            this.requireValue(
                branch.branchName,
                "Branch name",
            );


        const now =
            new Date()
                .toISOString();



        const payload = {


            id:
                branch.id,


            organization_id:
                this.organizationId,


            location_id:
                branch.locationId ?? null,


            branch_code:
                branchCode,


            branch_name:
                branchName,


            description:
                branch.description ?? null,


            address_line1:
                branch.addressLine1 ?? null,


            address_line2:
                branch.addressLine2 ?? null,


            city:
                branch.city ?? null,


            state:
                branch.state ?? null,


            country:
                branch.country ?? null,


            postal_code:
                branch.postalCode ?? null,


            phone:
                branch.phone ?? null,


            email:
                branch.email
                    ?.trim()
                    .toLowerCase()
                    ?? null,


            status:
                branch.status ??
                "Active",


            metadata:
                branch.metadata ??
                {},


            created_at:
                branch.createdAt ??
                now,


            updated_at:
                now,

        };


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


        return this.mapBranch(
            data as BranchRow,
        );

    }





    async delete(
        id: string,
    ):
        Promise<void> {


        const normalizedId =
            this.requireValue(
                id,
                "Branch id",
            );


        await super.delete(
            normalizedId,
        );

    }





    private requireValue(
        value:
            string |
            null |
            undefined,

        fieldName:
            string,

    ): string {


        const normalized =
            value?.trim();


        if (!normalized) {

            throw new Error(
                `${fieldName} is required.`,
            );

        }


        return normalized;

    }





    private mapBranch(
        row: BranchRow,
    ):
        Branch {


        return {

            id:
                row.id,


            organizationId:
                row.organization_id,


            locationId:
                row.location_id,


            branchCode:
                row.branch_code,


            branchName:
                row.branch_name,


            description:
                row.description ?? null,


            addressLine1:
                row.address_line1 ?? null,


            addressLine2:
                row.address_line2 ?? null,


            city:
                row.city ?? null,


            state:
                row.state ?? null,


            country:
                row.country ?? null,


            postalCode:
                row.postal_code ?? null,


            phone:
                row.phone ?? null,


            email:
                row.email ?? null,


            status:
                row.status ?? "Active",


            metadata:
                row.metadata ?? {},


            createdAt:
                row.created_at,


            updatedAt:
                row.updated_at,

        };

    }

}