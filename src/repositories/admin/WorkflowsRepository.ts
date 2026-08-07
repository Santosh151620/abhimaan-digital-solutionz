import type {
    Workflow,
} from "@/types/workflow/Workflow";

import {
    createSupabaseServerClient,
} from "@/lib/supabase/server-client";


import {
    TenantContextManager,
} from "@/lib/tenant/tenantContext";



type WorkflowRow = {

    id:string;

    organization_id:string;

    workflow_code:string;

    workflow_name:string;

    description:string | null;

    trigger_type:string | null;

    entity_type:string | null;

    action_type:string | null;

    configuration:Record<string,unknown> | null;

    status:string | null;

    is_system:boolean | null;

    created_at:string;

    updated_at:string;

};



export interface IWorkflowsRepository {


    findAll():
        Promise<Workflow[]>;


    findById(
        id:string,
    ):
        Promise<Workflow | null>;


    findByCode(
        code:string,
    ):
        Promise<Workflow | null>;


    save(
        workflow:Partial<Workflow>,
    ):
        Promise<Workflow>;


    delete(
        id:string,
    ):
        Promise<void>;

}



export class WorkflowsRepository
    implements IWorkflowsRepository {



    private async client(){

        return await createSupabaseServerClient();

    }



    private get organizationId():string {

        return TenantContextManager
            .require()
            .organizationId;

    }



    async findAll():
        Promise<Workflow[]> {


        const supabase =
            await this.client();


        const {
            data,
            error,

        } =
            await supabase

                .from("workflows")

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
                    this.mapWorkflow(
                        row as WorkflowRow,
                    ),
            );

    }





    async findById(
        id:string,
    ):
        Promise<Workflow | null>{


        const supabase =
            await this.client();



        const {
            data,
            error,

        } =
            await supabase

                .from("workflows")

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
            ? this.mapWorkflow(
                data as WorkflowRow,
            )
            : null;


    }





    async findByCode(
        code:string,
    ):
        Promise<Workflow | null>{


        const supabase =
            await this.client();



        const {
            data,
            error,

        } =
            await supabase

                .from("workflows")

                .select("*")

                .eq(
                    "organization_id",
                    this.organizationId,
                )

                .eq(
                    "workflow_code",
                    code
                        .trim()
                        .toUpperCase(),
                )

                .maybeSingle();



        if(error)
            throw error;



        return data
            ? this.mapWorkflow(
                data as WorkflowRow,
            )
            : null;


    }





    async save(
        workflow:Partial<Workflow>,
    ):
        Promise<Workflow>{


        if(!workflow.workflowCode?.trim()){

            throw new Error(
                "Workflow code is required.",
            );

        }


        if(!workflow.workflowName?.trim()){

            throw new Error(
                "Workflow name is required.",
            );

        }



        const supabase =
            await this.client();



        const now =
            new Date()
                .toISOString();



        const payload = {


            id:
                workflow.id,


            organization_id:
                this.organizationId,


            workflow_code:
                workflow.workflowCode
                    .trim()
                    .toUpperCase(),


            workflow_name:
                workflow.workflowName
                    .trim(),


            description:
                workflow.description ?? null,


            trigger_type:
                workflow.triggerType ?? "Manual",


            entity_type:
                workflow.entityType ?? null,


            action_type:
                workflow.actionType ?? null,


            configuration:
                workflow.configuration ?? {},


            status:
                workflow.status ?? "Active",


            is_system:
                workflow.isSystem ?? false,


            created_at:
                workflow.createdAt ?? now,


            updated_at:
                now,

        };



        const {
            data,
            error,

        } =
            await supabase

                .from("workflows")

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



        return this.mapWorkflow(
            data as WorkflowRow,
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

                .from("workflows")

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





    private mapWorkflow(
        row:WorkflowRow,
    ):
        Workflow {


        return {

            id:
                row.id,


            organizationId:
                row.organization_id,


            workflowCode:
                row.workflow_code,


            workflowName:
                row.workflow_name,


            description:
                row.description ?? "",


           triggerType:
    (row.trigger_type ?? "Manual") as Workflow["triggerType"],

entityType:
    row.entity_type ?? null,


actionType:
    row.action_type ?? null,


            configuration:
                row.configuration ?? {},


          status:
    (row.status ?? "Active") as Workflow["status"],


            isSystem:
                row.is_system ?? false,


            createdAt:
                row.created_at,


            updatedAt:
                row.updated_at,

        };

    }

}