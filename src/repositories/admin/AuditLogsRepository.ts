import type {
    AuditLog,
} from "@/types/admin/AuditLog";


import {
    createSupabaseServerClient,
} from "@/lib/supabase/server-client";


import {
    TenantContextManager,
} from "@/lib/tenant/tenantContext";



type AuditLogRow = {

    id:string;

    organization_id:string | null;

    user_id:string | null;

    user_name:string | null;

    action:string;

    entity_type:string;

    entity_id:string | null;

    description:string | null;

    metadata:Record<string,unknown> | null;

    ip_address:string | null;

    user_agent:string | null;

    created_at:string;

};





export class AuditLogsRepository {



    private async client(){

        return await createSupabaseServerClient();

    }





    private get organizationId():string {

        return TenantContextManager
            .require()
            .organizationId;

    }







    async findAll():

        Promise<AuditLog[]> {


        const supabase =
            await this.client();


        const {
            data,
            error,

        } =
            await supabase

                .from("audit_logs")

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
                    this.mapAuditLog(
                        row as AuditLogRow,
                    ),
            );

    }







    async findByEntity(

        entityType:string,

        entityId:string,

    ):
        Promise<AuditLog[]> {


        const supabase =
            await this.client();


        const {
            data,
            error,

        } =
            await supabase

                .from("audit_logs")

                .select("*")

                .eq(
                    "organization_id",
                    this.organizationId,
                )

                .eq(
                    "entity_type",
                    entityType,
                )

                .eq(
                    "entity_id",
                    entityId,
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
                    this.mapAuditLog(
                        row as AuditLogRow,
                    ),
            );

    }







    async findById(
        id:string,
    ):
        Promise<AuditLog | null>{


        const supabase =
            await this.client();



        const {
            data,
            error,

        } =
            await supabase

                .from("audit_logs")

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
            ? this.mapAuditLog(
                data as AuditLogRow,
            )
            : null;

    }







    private mapAuditLog(
        row:AuditLogRow,
    ):
        AuditLog {


        return {

            id:
                row.id,


            organizationId:
                row.organization_id ?? "",


            userId:
                row.user_id ?? undefined,


            userName:
                row.user_name ?? undefined,


                        action:
                row.action as AuditLog["action"],


            entityType:
                row.entity_type,


            entityId:
                row.entity_id ?? "",

            description:
                row.description ?? undefined,


            metadata:
                row.metadata ?? {},


            ipAddress:
                row.ip_address ?? undefined,


            userAgent:
                row.user_agent ?? undefined,


            createdAt:
                row.created_at,

        };

    }


}