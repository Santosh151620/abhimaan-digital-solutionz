import {
    createSupabaseServerClient,
} from "@/lib/supabase/server-client";

import {
    TenantContextManager,
} from "@/lib/tenant/tenantContext";

import type {
    WorkflowTask,
} from "@/types/workflow";


export class WorkflowRepository {


    private readonly table =
        "workflow_tasks";


    private async client() {

        return createSupabaseServerClient();

    }


    private get organizationId(): string {

        return TenantContextManager
            .require()
            .organizationId;

    }


    async getTasks(): Promise<WorkflowTask[]> {

        const supabase =
            await this.client();

        const organizationId =
            this.organizationId;


        const {
            data,
            error,
        } = await supabase
            .from(this.table)
            .select("*")
            .eq(
                "organization_id",
                organizationId,
            )
            .order(
                "dueAt",
                {
                    ascending: true,
                },
            );


        if (error) {

            console.error(
                "[WorkflowRepository.getTasks]",
                {
                    organizationId,
                    error,
                },
            );

            throw error;

        }


        return (
            data ?? []
        ) as WorkflowTask[];

    }


    async saveTasks(
        tasks: WorkflowTask[],
    ): Promise<void> {

        if (
            tasks.length === 0
        ) {

            return;

        }


        const supabase =
            await this.client();

        const organizationId =
            this.organizationId;


        const payload =
            tasks.map(
                (
                    task,
                ) => ({

                    ...task,

                    organization_id:
                        organizationId,

                }),
            );


        const {
            error,
        } = await supabase
            .from(this.table)
            .insert(
                payload,
            );


        if (error) {

            console.error(
                "[WorkflowRepository.saveTasks]",
                {
                    organizationId,
                    error,
                },
            );

            throw error;

        }

    }


    async updateTask(

        taskId: string,

        updates:
            Partial<WorkflowTask>,

    ): Promise<void> {

        const normalizedTaskId =
            this.validateTaskId(
                taskId,
            );


        if (
            !updates ||
            Object.keys(updates).length === 0
        ) {

            return;

        }


        const supabase =
            await this.client();

        const organizationId =
            this.organizationId;


        const {
            error,
        } = await supabase
            .from(this.table)
            .update(
                updates,
            )
            .eq(
                "id",
                normalizedTaskId,
            )
            .eq(
                "organization_id",
                organizationId,
            );


        if (error) {

            console.error(
                "[WorkflowRepository.updateTask]",
                {
                    organizationId,
                    taskId:
                        normalizedTaskId,
                    error,
                },
            );

            throw error;

        }

    }


    async deleteTask(
        taskId: string,
    ): Promise<void> {

        const normalizedTaskId =
            this.validateTaskId(
                taskId,
            );


        const supabase =
            await this.client();

        const organizationId =
            this.organizationId;


        const {
            error,
        } = await supabase
            .from(this.table)
            .delete()
            .eq(
                "id",
                normalizedTaskId,
            )
            .eq(
                "organization_id",
                organizationId,
            );


        if (error) {

            console.error(
                "[WorkflowRepository.deleteTask]",
                {
                    organizationId,
                    taskId:
                        normalizedTaskId,
                    error,
                },
            );

            throw error;

        }

    }


    async getTaskById(

        taskId: string,

    ): Promise<WorkflowTask | null> {

        const normalizedTaskId =
            this.validateTaskId(
                taskId,
            );


        const supabase =
            await this.client();

        const organizationId =
            this.organizationId;


        const {
            data,
            error,
        } = await supabase
            .from(this.table)
            .select("*")
            .eq(
                "id",
                normalizedTaskId,
            )
            .eq(
                "organization_id",
                organizationId,
            )
            .maybeSingle();


        if (error) {

            console.error(
                "[WorkflowRepository.getTaskById]",
                {
                    organizationId,
                    taskId:
                        normalizedTaskId,
                    error,
                },
            );

            throw error;

        }


        return (
            data as WorkflowTask | null
        ) ?? null;

    }


    private validateTaskId(
        taskId: string,
    ): string {

        const normalizedTaskId =
            typeof taskId === "string"
                ? taskId.trim()
                : "";


        if (
            !normalizedTaskId
        ) {

            throw new Error(
                "Workflow task id is required.",
            );

        }


        return normalizedTaskId;

    }

}