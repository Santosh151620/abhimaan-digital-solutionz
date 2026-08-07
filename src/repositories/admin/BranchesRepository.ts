import {
    TenantContextManager,
} from "@/lib/tenant/tenantContext";


import type {
    Branch,
} from "@/types/admin/Branch";


import {
    createSupabaseServerClient,
} from "@/lib/supabase/server-client";


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
    status: Branch["status"] | null;
    metadata: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
};


export class BranchesRepository {





    private async client() {


        return await createSupabaseServerClient();


    }







    private get organizationId(): string {


        return TenantContextManager
            .require()
            .organizationId;


    }









    async findAll(): Promise<Branch[]> {



        const supabase =

            await this.client();







        const {

            data,

            error,

        } = await supabase





            .from("branches")





            .select("*")





            .eq(

                "organization_id",

                this.organizationId,

            )





            .order(

                "created_at",

                {

                    ascending:false,

                },

            );







        if(error){

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
    ): Promise<Branch | null> {

        const supabase =
            await this.client();

        const {
            data,
            error,
        } = await supabase
            .from("branches")
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
            ? this.mapBranch(
                  data as BranchRow,
              )
            : null;
    }

    async save(

        branch: Partial<Branch>,

    ): Promise<Branch> {

        const supabase =

            await this.client();
        
        if (!branch.branchCode?.trim()) {
            throw new Error("Branch code is required.");
        }

        if (!branch.branchName?.trim()) {
            throw new Error("Branch name is required.");
        }

        const now =
            new Date().toISOString();

        const payload: Partial<BranchRow> = {
            id: branch.id,
            organization_id: this.organizationId,
            location_id: branch.locationId ?? null,
            branch_code: branch.branchCode.trim().toUpperCase(),
            branch_name: branch.branchName.trim(),
            description: branch.description ?? null,
            address_line1: branch.addressLine1 ?? null,
            address_line2: branch.addressLine2 ?? null,
            city: branch.city ?? null,
            state: branch.state ?? null,
            country: branch.country ?? null,
            postal_code: branch.postalCode ?? null,
            phone: branch.phone ?? null,
            email: branch.email ?? null,
            status: branch.status ?? "Active",
            metadata: branch.metadata ?? {},
            created_at: branch.createdAt ?? now,
            updated_at: now,
        };

        const {

            data,

            error,

        } = await supabase

            .from("branches")
            .upsert(

                payload,

                {

                    onConflict:"id",

                },

            )
            .select()

            .single();

        if(error){

            throw error;

        }

      return this.mapBranch(
    data as BranchRow,
);

    }









    async delete(
        id: string,
    ): Promise<void> {

        const supabase =
            await this.client();

        const {
            error,
        } = await supabase
            .from("branches")
            .delete()
            .eq(
                "organization_id",
                this.organizationId,
            )
            .eq(
                "id",
                id,
            );

        if (error) {
            throw error;
        }
    }

    private mapBranch(
        row: BranchRow,
    ): Branch {

        return {
            id: row.id,
            organizationId: row.organization_id,
            locationId: row.location_id,
            branchCode: row.branch_code,
            branchName: row.branch_name,
            description: row.description ?? null,
            addressLine1: row.address_line1 ?? null,
            addressLine2: row.address_line2 ?? null,
            city: row.city ?? null,
            state: row.state ?? null,
            country: row.country ?? null,
            postalCode: row.postal_code ?? null,
            phone: row.phone ?? null,
            email: row.email ?? null,
            status: row.status ?? "Active",
            metadata: row.metadata ?? {},
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }
}
