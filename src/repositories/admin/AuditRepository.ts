import type {
    AuditRecord,
} from "@/types/admin/Audit";


import {
    createSupabaseServerClient,
} from "@/lib/supabase/server-client";


import {
    TenantContextManager,
} from "@/lib/tenant/tenantContext";




type AuditRow = {

    id:string;

    organization_id:string;

    user_id:string | null;

    action:string;

    entity_type:string;

    entity_id:string | null;

    description:string | null;

    metadata:Record<string,unknown> | null;

    created_at:string;

};





export interface IAuditRepository {


    log(
        entry:AuditRecord
    ):Promise<void>;



    getLogs(
        options?: {

            entityType?:string;

            entityId?:string;

            limit?:number;

        }
    ):
        Promise<AuditRecord[]>;

}





export class AuditRepository
    implements IAuditRepository {




    private async client(){

        return await createSupabaseServerClient();

    }





    private get organizationId():string {

        return TenantContextManager
            .require()
            .organizationId;

    }







    async log(
        entry:AuditRecord
    ):
        Promise<void>{


        const supabase =
            await this.client();



        const {
            error,

        } =
            await supabase

                .from("audit_logs")

                .insert({

                    id:
                        entry.id,


                    organization_id:
                        this.organizationId,


                    user_id:
                        entry.userId ?? null,


                    action:
                        entry.action,


                    entity_type:
                        entry.entityType,


                    entity_id:
                        entry.entityId ?? null,


                    description:
                        entry.description ?? null,


                    metadata:
                        entry.metadata ?? {},


                    created_at:
                        entry.createdAt
                        ??
                        new Date()
                            .toISOString(),

                });



        if(error)
            throw error;


    }







    async getLogs(
        options?: {

            entityType?:string;

            entityId?:string;

            limit?:number;

        }
    ):
        Promise<AuditRecord[]> {


        const supabase =
            await this.client();



        let query =
            supabase

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



        if(options?.entityType){

            query =
                query.eq(
                    "entity_type",
                    options.entityType,
                );

        }



        if(options?.entityId){

            query =
                query.eq(
                    "entity_id",
                    options.entityId,
                );

        }



        if(options?.limit){

            query =
                query.limit(
                    options.limit,
                );

        }




        const {
            data,
            error,

        } =
            await query;



        if(error)
            throw error;



        return (data ?? [])
            .map(
                row =>
                    this.mapAudit(
                        row as AuditRow,
                    ),
            );

    }







    private mapAudit(
        row:AuditRow,
    ):
        AuditRecord {

        return {

            id:
                row.id,


            organizationId:
                row.organization_id,


            userId:
                row.user_id ?? undefined,


            module:
                "Admin",


            entity:
                row.entity_type,


            entityType:
                row.entity_type,


            entityId:
                row.entity_id ?? "",


            action:
                row.action as AuditRecord["action"],

actionType:
    "OTHER" as AuditRecord["actionType"],


         severity:
    "Info" as AuditRecord["severity"],


            description:
                row.description ?? undefined,


            metadata:
                row.metadata ?? {},


            createdAt:
                row.created_at,

        };

    }

}