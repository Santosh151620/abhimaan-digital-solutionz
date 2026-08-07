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

        if (!id?.trim()) {

            throw new Error(
                "Workflow id is required.",
            );

        }

        return this.repository.findById(
            id.trim(),
        );

    }



    async findByCode(

        code: string,

    ):

        Promise<Workflow | null> {


        if (!code?.trim()) {

            throw new Error(
                "Workflow code is required.",
            );

        }


        return this.repository.findByCode(
            code.trim(),
        );

    }



    async save(

        workflow: Partial<Workflow>,

    ):

        Promise<Workflow> {


        if (!workflow.workflowCode?.trim()) {

            throw new Error(
                "Workflow code is required.",
            );

        }


        if (!workflow.workflowName?.trim()) {

            throw new Error(
                "Workflow name is required.",
            );

        }


        return this.repository.save({

            ...workflow,

            workflowCode:
                workflow.workflowCode
                    .trim()
                    .toUpperCase(),

            workflowName:
                workflow.workflowName
                    .trim(),

        });

    }



    async delete(

        id: string,

    ):

        Promise<void> {


        if (!id?.trim()) {

            throw new Error(
                "Workflow id is required.",
            );

        }


        await this.repository.delete(
            id.trim(),
        );

    }

}


export const workflowsService =
    new WorkflowsService();