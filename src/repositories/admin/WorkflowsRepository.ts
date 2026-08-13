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
    id: string;
    organization_id: string;
    workflow_code: string;
    workflow_name: string;
    description: string | null;
    trigger_type: string | null;
    entity_type: string | null;
    action_type: string | null;
    configuration: Record<string, unknown> | null;
    status: string | null;
    is_system: boolean | null;
    created_at: string;
    updated_at: string;
};


interface IWorkflowsRepository {

    findAll(): Promise<Workflow[]>;


    findById(
        id: string,
    ): Promise<Workflow | null>;


    findByCode(
        code: string,
    ): Promise<Workflow | null>;


    save(
        workflow: Partial<Workflow>,
    ): Promise<Workflow>;


    delete(
        id: string,
    ): Promise<void>;
}


export class WorkflowsRepository
    implements IWorkflowsRepository {


    private async client() {

        return createSupabaseServerClient();

    }


    private get organizationId(): string {

        const organizationId =
            TenantContextManager
                .require()
                .organizationId
                .trim();


        if (!organizationId) {

            throw new Error(
                "Organization context is required.",
            );

        }


        return organizationId;

    }


    async findAll(): Promise<Workflow[]> {

        const supabase =
            await this.client();


        const {
            data,
            error,
        } = await supabase
            .from("workflows")
            .select("*")
            .eq(
                "organization_id",
                this.organizationId,
            )
            .order(
                "created_at",
                {
                    ascending: false,
                },
            );


        if (error) {

            throw error;

        }


        return (data ?? []).map(
            (row) =>
                this.mapWorkflow(
                    row as WorkflowRow,
                ),
        );

    }


    async findById(
        id: string,
    ): Promise<Workflow | null> {

        const normalizedId =
            this.normalizeId(
                id,
            );


        const supabase =
            await this.client();


        const {
            data,
            error,
        } = await supabase
            .from("workflows")
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
            ? this.mapWorkflow(
                data as WorkflowRow,
            )
            : null;

    }


    async findByCode(
        code: string,
    ): Promise<Workflow | null> {

        const normalizedCode =
            this.normalizeCode(
                code,
            );


        const supabase =
            await this.client();


        const {
            data,
            error,
        } = await supabase
            .from("workflows")
            .select("*")
            .eq(
                "organization_id",
                this.organizationId,
            )
            .eq(
                "workflow_code",
                normalizedCode,
            )
            .maybeSingle();


        if (error) {

            throw error;

        }


        return data
            ? this.mapWorkflow(
                data as WorkflowRow,
            )
            : null;

    }


    async save(
        workflow: Partial<Workflow>,
    ): Promise<Workflow> {

        this.validateWorkflow(
            workflow,
        );


        const organizationId =
            this.organizationId;


        const workflowCode =
            this.normalizeCode(
                workflow.workflowCode ?? "",
            );


        const workflowName =
            this.normalizeName(
                workflow.workflowName ?? "",
            );


        const supabase =
            await this.client();


        const now =
            new Date().toISOString();


        if (workflow.id) {

            const normalizedId =
                this.normalizeId(
                    workflow.id,
                );


            const existing =
                await supabase
                    .from("workflows")
                    .select("*")
                    .eq(
                        "organization_id",
                        organizationId,
                    )
                    .eq(
                        "id",
                        normalizedId,
                    )
                    .maybeSingle();


            if (existing.error) {

                throw existing.error;

            }


            if (!existing.data) {

                throw new Error(
                    "Workflow not found.",
                );

            }


            const existingWorkflow =
                existing.data as WorkflowRow;


            if (
                existingWorkflow.is_system === true &&
                workflow.isSystem === false
            ) {

                throw new Error(
                    "System workflows cannot be converted to non-system workflows.",
                );

            }


            const payload = {

                workflow_code:
                    workflowCode,

                workflow_name:
                    workflowName,

                description:
                    workflow.description ??
                    existingWorkflow.description ??
                    null,

                trigger_type:
                    workflow.triggerType ??
                    existingWorkflow.trigger_type ??
                    "Manual",

                entity_type:
                    workflow.entityType ??
                    existingWorkflow.entity_type ??
                    null,

                action_type:
                    workflow.actionType ??
                    existingWorkflow.action_type ??
                    null,

                configuration:
                    workflow.configuration ??
                    existingWorkflow.configuration ??
                    {},

                status:
                    workflow.status ??
                    existingWorkflow.status ??
                    "Active",

                is_system:
                    existingWorkflow.is_system ??
                    workflow.isSystem ??
                    false,

                updated_at:
                    now,

            };


            const {
                data,
                error,
            } = await supabase
                .from("workflows")
                .update(
                    payload,
                )
                .eq(
                    "organization_id",
                    organizationId,
                )
                .eq(
                    "id",
                    normalizedId,
                )
                .select("*")
                .single();


            if (error) {

                throw error;

            }


            return this.mapWorkflow(
                data as WorkflowRow,
            );

        }


        const payload = {

            organization_id:
                organizationId,

            workflow_code:
                workflowCode,

            workflow_name:
                workflowName,

            description:
                workflow.description ??
                null,

            trigger_type:
                workflow.triggerType ??
                "Manual",

            entity_type:
                workflow.entityType ??
                null,

            action_type:
                workflow.actionType ??
                null,

            configuration:
                workflow.configuration ??
                {},

            status:
                workflow.status ??
                "Active",

            is_system:
                workflow.isSystem ??
                false,

            created_at:
                workflow.createdAt ??
                now,

            updated_at:
                now,

        };


        const {
            data,
            error,
        } = await supabase
            .from("workflows")
            .insert(
                payload,
            )
            .select("*")
            .single();


        if (error) {

            throw error;

        }


        return this.mapWorkflow(
            data as WorkflowRow,
        );

    }


    async delete(
        id: string,
    ): Promise<void> {

        const normalizedId =
            this.normalizeId(
                id,
            );


        const supabase =
            await this.client();


        const existing =
            await supabase
                .from("workflows")
                .select(
                    "id, is_system",
                )
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "id",
                    normalizedId,
                )
                .maybeSingle();


        if (existing.error) {

            throw existing.error;

        }


        if (!existing.data) {

            throw new Error(
                "Workflow not found.",
            );

        }


        if (
            existing.data.is_system === true
        ) {

            throw new Error(
                "System workflows cannot be deleted.",
            );

        }


        const {
            error,
        } = await supabase
            .from("workflows")
            .delete()
            .eq(
                "organization_id",
                this.organizationId,
            )
            .eq(
                "id",
                normalizedId,
            );


        if (error) {

            throw error;

        }

    }


    private validateWorkflow(
        workflow: Partial<Workflow>,
    ): void {

        if (
            !workflow ||
            typeof workflow !== "object" ||
            Array.isArray(workflow)
        ) {

            throw new Error(
                "Workflow is required.",
            );

        }


        this.normalizeCode(
            workflow.workflowCode ?? "",
        );


        this.normalizeName(
            workflow.workflowName ?? "",
        );


        if (
            workflow.triggerType !== undefined &&
            !this.isValidTriggerType(
                workflow.triggerType,
            )
        ) {

            throw new Error(
                "Invalid workflow trigger type.",
            );

        }


        if (
            workflow.status !== undefined &&
            !this.isValidStatus(
                workflow.status,
            )
        ) {

            throw new Error(
                "Invalid workflow status.",
            );

        }


        if (
            workflow.configuration !== undefined &&
            (
                typeof workflow.configuration !== "object" ||
                workflow.configuration === null ||
                Array.isArray(
                    workflow.configuration,
                )
            )
        ) {

            throw new Error(
                "Workflow configuration must be an object.",
            );

        }

    }


    private normalizeId(
        id: string,
    ): string {

        const normalizedId =
            typeof id === "string"
                ? id.trim()
                : "";


        if (!normalizedId) {

            throw new Error(
                "Workflow id is required.",
            );

        }


        return normalizedId;

    }


    private normalizeCode(
        code: string,
    ): string {

        const normalizedCode =
            typeof code === "string"
                ? code.trim().toUpperCase()
                : "";


        if (!normalizedCode) {

            throw new Error(
                "Workflow code is required.",
            );

        }


        return normalizedCode;

    }


    private normalizeName(
        name: string,
    ): string {

        const normalizedName =
            typeof name === "string"
                ? name.trim()
                : "";


        if (!normalizedName) {

            throw new Error(
                "Workflow name is required.",
            );

        }


        return normalizedName;

    }


    private isValidTriggerType(
        triggerType: Workflow["triggerType"],
    ): boolean {

        return (

            triggerType === "Manual" ||

            triggerType === "Automatic" ||

            triggerType === "Event" ||

            triggerType === "Schedule"

        );

    }


    private isValidStatus(
        status: Workflow["status"],
    ): boolean {

        return (

            status === "Active" ||

            status === "Inactive" ||

            status === "Draft"

        );

    }


    private mapWorkflow(
        row: WorkflowRow,
    ): Workflow {

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
                row.description,

            triggerType:
                (row.trigger_type ??
                    "Manual") as Workflow["triggerType"],

            entityType:
                row.entity_type,

            actionType:
                row.action_type,

            configuration:
                row.configuration ?? {},

            status:
                (row.status ??
                    "Active") as Workflow["status"],

            isSystem:
                row.is_system ?? false,

            createdAt:
                row.created_at,

            updatedAt:
                row.updated_at,

        };

    }

}