import type {
    Branch,
} from "@/types/admin/Branch";

import {
    BranchesRepository,
} from "@/repositories/admin/BranchesRepository";

export class BranchesService {

    constructor(

        private readonly repository =
            new BranchesRepository(),

    ) {}

    async list():

    Promise<Branch[]> {

        return this.repository.findAll();

    }

    async findById(

        id: string,

    ):

    Promise<Branch | null> {

        this.validateId(
            id,
        );

        return this.repository.findById(
            id.trim(),
        );

    }

    async save(

        branch: Partial<Branch>,

    ):

    Promise<Branch> {

        this.validateBranch(
            branch,
        );

        return this.repository.save({

            ...branch,

            branchCode:
                branch.branchCode!
                    .trim()
                    .toUpperCase(),

            branchName:
                branch.branchName!
                    .trim(),

        });

    }

    async delete(

        id: string,

    ):

    Promise<void> {

        this.validateId(
            id,
        );

        await this.repository.delete(
            id.trim(),
        );

    }

    private validateBranch(

        branch: Partial<Branch>,

    ): void {

        if (!branch) {

            throw new Error(
                "Branch is required.",
            );

        }

        if (
            !branch.branchCode?.trim()
        ) {

            throw new Error(
                "Branch code is required.",
            );

        }

        if (
            !branch.branchName?.trim()
        ) {

            throw new Error(
                "Branch name is required.",
            );

        }

    }

    private validateId(

        id: string,

    ): void {

        if (!id?.trim()) {

            throw new Error(
                "Branch id is required.",
            );

        }

    }

}

export const branchesService =
    new BranchesService();