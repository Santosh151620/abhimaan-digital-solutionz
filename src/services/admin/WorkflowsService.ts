import type {
    Workflow,
} from "@/types/workflow/Workflow";


import {
    WorkflowsRepository,
} from "@/repositories/admin/WorkflowsRepository";


export class WorkflowsService {


    constructor(

        private readonly repository =
            new WorkflowsRepository(),

    ) {}




    async list():

    Promise<Workflow[]> {

        return this.repository.findAll();

    }




    async findById(

        id: string,

    ):

    Promise<Workflow | null> {

        const normalizedId =
            this.validateId(
                id,
            );


        return this.repository.findById(

            normalizedId,

        );

    }




    async findByCode(

        code: string,

    ):

    Promise<Workflow | null> {

        const normalizedCode =
            this.normalizeCode(
                code,
            );


        return this.repository.findByCode(

            normalizedCode,

        );

    }




    async save(

        workflow: Partial<Workflow>,

    ):

    Promise<Workflow> {

        this.validateWorkflowInput(
            workflow,
        );


        const normalizedWorkflow =
            this.validateWorkflow(
                workflow,
            );


        const normalizedId =
            workflow.id
                ? this.validateId(
                    workflow.id,
                )
                : undefined;


        const existing =
            await this.repository.findByCode(

                normalizedWorkflow
                    .workflowCode,

            );


        if (

            existing &&

            existing.id !== normalizedId

        ) {

            throw new Error(
                "Workflow code already exists.",
            );

        }


        return this.repository.save(

            {

                ...workflow,

                ...(normalizedId
                    ? {
                        id:
                            normalizedId,
                    }
                    : {}),

                workflowCode:
                    normalizedWorkflow
                        .workflowCode,

                workflowName:
                    normalizedWorkflow
                        .workflowName,

            },

        );

    }




    async delete(

        id: string,

    ):

    Promise<void> {

        const normalizedId =
            this.validateId(
                id,
            );


        const workflow =
            await this.repository.findById(

                normalizedId,

            );


        if (!workflow) {

            throw new Error(
                "Workflow not found.",
            );

        }


        await this.repository.delete(

            normalizedId,

        );

    }




    private validateWorkflowInput(

        workflow:
            Partial<Workflow>,

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

    }




    private validateWorkflow(

        workflow:
            Partial<Workflow>,

    ): {

        workflowCode: string;

        workflowName: string;

    } {

        const workflowCode =
            this.normalizeCode(
                workflow.workflowCode ?? "",
            );


        const workflowName =
            typeof workflow.workflowName ===
            "string"
                ? workflow.workflowName.trim()
                : "";


        if (!workflowName) {

            throw new Error(
                "Workflow name is required.",
            );

        }


        return {

            workflowCode,

            workflowName,

        };

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




    private validateId(

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

}


export const workflowsService =
    new WorkflowsService();