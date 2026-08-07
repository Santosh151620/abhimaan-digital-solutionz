import type {
    Policy,
} from "@/types/admin/Policy";


import {
    createSupabaseServerClient,
} from "@/lib/supabase/server-client";


import {
    TenantContextManager,
} from "@/lib/tenant/tenantContext";



type PolicyRow = {

    id:string;

    organization_id:string;

    policy_code:string;

    policy_name:string;

    description:string | null;

    type:Policy["type"] | null;

    value:Record<string, unknown> | null;

    is_mandatory:boolean | null;

    status:Policy["status"] | null;

    created_at:string;

    updated_at:string;

};





export class PoliciesRepository {



    private async client(){

        return await createSupabaseServerClient();

    }





    private get organizationId():string {

        return TenantContextManager
            .require()
            .organizationId;

    }







    async findAll():

        Promise<Policy[]> {


        const supabase =
            await this.client();


        const {
            data,
            error,

        } =
            await supabase

                .from("policies")

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


        if(error)
            throw error;



        return (data ?? [])
            .map(
                row =>
                    this.mapPolicy(
                        row as PolicyRow,
                    ),
            );

    }







    async findById(
        id:string,
    ):
        Promise<Policy | null>{


        const supabase =
            await this.client();


        const {
            data,
            error,

        } =
            await supabase

                .from("policies")

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
            ? this.mapPolicy(
                data as PolicyRow,
            )
            : null;

    }







    async findByCode(
        code:string,
    ):
        Promise<Policy | null>{


        const supabase =
            await this.client();


        const {
            data,
            error,

        } =
            await supabase

                .from("policies")

                .select("*")

                .eq(
                    "organization_id",
                    this.organizationId,
                )

                .eq(
                    "policy_code",
                    code
                        .trim()
                        .toUpperCase(),
                )

                .maybeSingle();



        if(error)
            throw error;



        return data
            ? this.mapPolicy(
                data as PolicyRow,
            )
            : null;

    }







    async save(
        policy:Partial<Policy>,
    ):
        Promise<Policy>{


        const supabase =
            await this.client();



        if(!policy.policyCode?.trim()){

            throw new Error(
                "Policy code is required.",
            );

        }


        if(!policy.policyName?.trim()){

            throw new Error(
                "Policy name is required.",
            );

        }



        const now =
            new Date()
                .toISOString();



        const payload = {


            id:
                policy.id,


            organization_id:
                this.organizationId,


            policy_code:
                policy.policyCode
                    .trim()
                    .toUpperCase(),


            policy_name:
                policy.policyName
                    .trim(),


            description:
                policy.description ?? null,


            type:
                policy.type ?? "Organization",


            value:
                policy.value ?? {},


            is_mandatory:
                policy.isMandatory ?? false,


            status:
                policy.status ?? "Active",


            created_at:
                policy.createdAt ?? now,


            updated_at:
                now,


        };



        const {
            data,
            error,

        } =
            await supabase

                .from("policies")

                .upsert(
                    payload,
                    {
                        onConflict:"id",
                    },
                )

                .select()

                .single();



        if(error)
            throw error;



        return this.mapPolicy(
            data as PolicyRow,
        );

    }







    async delete(
        id:string,
    ):
        Promise<void>{


        const supabase =
            await this.client();



        const {
            error,

        } =
            await supabase

                .from("policies")

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







    private mapPolicy(
        row:PolicyRow,
    ):
        Policy {


        return {

            id:
                row.id,


            organizationId:
                row.organization_id,


            policyCode:
                row.policy_code,


            policyName:
                row.policy_name,


            description:
                row.description ?? "",


            type:
                row.type ?? "Organization",


            value:
                row.value ?? {},


            isMandatory:
                row.is_mandatory ?? false,


            status:
                row.status ?? "Active",


            createdAt:
                row.created_at,


            updatedAt:
                row.updated_at,

        };

    }


}