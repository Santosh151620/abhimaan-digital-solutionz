/**
 * ============================================================================
 * ADS WORKFLOW SERVICE
 * ============================================================================
 *
 * Canonical business-service boundary for workflow definitions.
 *
 * Responsibilities:
 *
 * - Validate workflow identifiers and input.
 * - Normalize workflow codes/names.
 * - Prevent duplicate workflow codes.
 * - Delegate persistence to WorkflowsRepository.
 * - Preserve the repository/service separation.
 *
 * IMPORTANT:
 *
 * This service does not perform direct database access.
 * Persistence, authentication context and RLS remain below the repository
 * boundary.
 * ============================================================================
 */

import type {
    Workflow,
} from "@/types/workflow/Workflow";


import {
    WorkflowsRepository,
} from "@/repositories/admin/WorkflowsRepository";



/**
 * Canonical workflow service.
 */
export class WorkflowsService {


    constructor(
        private readonly repository:
            WorkflowsRepository =
            new WorkflowsRepository(),
    ) {}



    /**
     * Return all workflows available through the repository boundary.
     */
    async list():
        Promise<Workflow[]> {

        return this.repository.findAll();

    }



    /**
     * Find a workflow by its identifier.
     */
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



    /**
     * Find a workflow using its canonical workflow code.
     */
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



    /**
     * Create or update a workflow.
     *
     * Workflow code is treated as the stable business identifier and is
     * normalized before persistence.
     *
     * Duplicate codes are rejected unless the existing record is the same
     * workflow being updated.
     */
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
            workflow.id !== undefined
                ? this.validateId(
                    workflow.id,
                )
                : undefined;


        const existing =
            await this.repository.findByCode(
                normalizedWorkflow.workflowCode,
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



    /**
     * Delete an existing workflow.
     *
     * Existence is checked at the service boundary so callers receive a
     * deterministic domain error rather than relying on repository behavior.
     */
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



    /**
     * Validate the basic workflow input contract.
     */
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



    /**
     * Validate and normalize workflow business fields.
     */
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


        if (
            !workflowName
        ) {

            throw new Error(
                "Workflow name is required.",
            );

        }


        return {

            workflowCode,

            workflowName,

        };

    }



    /**
     * Normalize workflow codes into their canonical representation.
     */
    private normalizeCode(
        code: string,
    ): string {

        const normalizedCode =
            typeof code === "string"
                ? code.trim().toUpperCase()
                : "";


        if (
            !normalizedCode
        ) {

            throw new Error(
                "Workflow code is required.",
            );

        }


        return normalizedCode;

    }



    /**
     * Validate and normalize workflow identifiers.
     */
    private validateId(
        id: string,
    ): string {

        const normalizedId =
            typeof id === "string"
                ? id.trim()
                : "";


        if (
            !normalizedId
        ) {

            throw new Error(
                "Workflow id is required.",
            );

        }


        return normalizedId;

    }

}



/**
 * Canonical application-wide workflow service instance.
 */
export const workflowsService =
    new WorkflowsService();