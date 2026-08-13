import type {
    Branch,
} from "@/types/admin/Branch";


import {
    BranchesRepository,
} from "@/repositories/admin/BranchesRepository";


export class BranchesService {


    constructor(

        private readonly repository:
            BranchesRepository =
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

        const normalizedId =
            this.validateId(
                id,
            );


        return this.repository.findById(

            normalizedId,

        );

    }


    async save(

        branch:
            Partial<Branch>,

    ):

    Promise<Branch> {

        const normalizedBranch =
            this.validateBranch(
                branch,
            );


        return this.repository.save(

            {

                ...branch,

                branchCode:
                    normalizedBranch.branchCode
                        .toUpperCase(),

                branchName:
                    normalizedBranch.branchName
                        .trim(),

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


        await this.repository.delete(

            normalizedId,

        );

    }


    private validateBranch(

        branch:
            Partial<Branch>,

    ): {

        branchCode: string;

        branchName: string;

    } {

        if (!branch) {

            throw new Error(

                "Branch is required.",

            );

        }


        const branchCode =
            typeof branch.branchCode ===
            "string"
                ? branch.branchCode.trim()
                : "";


        const branchName =
            typeof branch.branchName ===
            "string"
                ? branch.branchName.trim()
                : "";


        if (!branchCode) {

            throw new Error(

                "Branch code is required.",

            );

        }


        if (!branchName) {

            throw new Error(

                "Branch name is required.",

            );

        }


        return {

            branchCode,

            branchName,

        };

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

                "Branch id is required.",

            );

        }


        return normalizedId;

    }

}


export const branchesService =
    new BranchesService();