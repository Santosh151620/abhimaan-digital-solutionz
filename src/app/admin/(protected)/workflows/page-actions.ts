"use server";

import type {
    Workflow,
} from "@/types/workflow/Workflow";

import {
    WorkflowsRepository,
} from "@/repositories/admin/WorkflowsRepository";

const repository =
    new WorkflowsRepository();

export async function getWorkflows(): Promise<Workflow[]> {
    return repository.findAll();
}

export async function saveWorkflow(
    workflow: Partial<Workflow>,
): Promise<Workflow> {
    return repository.save(
        workflow,
    );
}

export async function deleteWorkflow(
    id: string,
): Promise<void> {
    await repository.delete(
        id,
    );
}
