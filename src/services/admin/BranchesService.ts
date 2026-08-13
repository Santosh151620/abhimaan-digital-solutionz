import type {
    Branch,
} from "@/types/admin/Branch";


import {
    BranchesRepository,
} from "@/repositories/admin/BranchesRepository";


import {
    createSupabaseServerClient,
} from "@/lib/supabase/server-client";



export class BranchesService {


    constructor(

        private readonly repository:
            BranchesRepository,

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




    async findByCode(

        code: string,

    ):

    Promise<Branch | null> {


        const normalizedCode =
            this.normalizeCode(
                code,
            );


        return this.repository.findByCode(
            normalizedCode,
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


        return this.repository.save({

            ...branch,

            branchCode:
                normalizedBranch.branchCode,

            branchName:
                normalizedBranch.branchName,

        });

    }




    async delete(

        id: string,

    ):

    Promise<void> {


        const normalizedId =
            this.validateId(
                id,
            );


        const existing =
            await this.repository.findById(
                normalizedId,
            );


        if (!existing) {

            throw new Error(
                "Branch not found.",
            );

        }


        await this.repository.delete(
            normalizedId,
        );

    }




    private validateBranch(

        branch:
            Partial<Branch>,

    ) {


        if (!branch) {

            throw new Error(
                "Branch is required.",
            );

        }


        return {

            branchCode:
                this.normalizeCode(
                    branch.branchCode,
                ),


            branchName:
                this.normalizeText(
                    branch.branchName,
                    "Branch name is required.",
                ),

        };

    }




    private normalizeCode(

        value:
            string |
            undefined,

    ): string {


        const normalized =
            value?.trim()
                .toUpperCase()
            ?? "";


        if (!normalized) {

            throw new Error(
                "Branch code is required.",
            );

        }


        return normalized;

    }




    private normalizeText(

        value:
            string |
            undefined,

        message:
            string,

    ): string {


        const normalized =
            value?.trim()
            ?? "";


        if (!normalized) {

            throw new Error(
                message,
            );

        }


        return normalized;

    }




    private validateId(

        id:
            string,

    ): string {


        const normalized =
            id?.trim()
            ?? "";


        if (!normalized) {

            throw new Error(
                "Branch id is required.",
            );

        }


        return normalized;

    }

}



export async function getBranchesService() {

    const supabase =
        await createSupabaseServerClient();


    return new BranchesService(

        new BranchesRepository(
            supabase,
        ),

    );

}