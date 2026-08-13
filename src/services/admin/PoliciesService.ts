/**
 * ============================================================================
 * ADS ENTERPRISE PLATFORM
 *
 * Policies Service
 *
 * Application layer for administrative policy management.
 *
 * Responsibilities:
 * - Policy listing
 * - Policy lookup by ID
 * - Policy lookup by code
 * - Policy persistence
 * - Policy deletion
 * - Policy input validation
 * - Policy code normalization
 * - Duplicate policy-code protection
 * ============================================================================
 */


import type {
    Policy,
} from "@/types/admin/Policy";


import {
    PoliciesRepository,
} from "@/repositories/admin/PoliciesRepository";





export class PoliciesService {





    constructor(

        private readonly repository:
            PoliciesRepository =
                new PoliciesRepository(),

    ) {}









    async list():

    Promise<Policy[]> {


        return this.repository.findAll();


    }









    async findById(

        id: string,

    ):

    Promise<Policy | null> {


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

    Promise<Policy | null> {


        const normalizedCode =
            this.normalizeCode(

                code,

            );



        return this.repository.findByCode(

            normalizedCode,

        );


    }









    async save(

        policy: Partial<Policy>,

    ):

    Promise<Policy> {


        const normalizedPolicy =
            this.validatePolicy(

                policy,

            );



        const existing =
            await this.repository.findByCode(

                normalizedPolicy.policyCode,

            );



        if (

            existing &&

            existing.id !== policy.id

        ) {


            throw new Error(

                "Policy code already exists.",

            );


        }



        return this.repository.save(

            {

                ...policy,


                policyCode:
                    normalizedPolicy.policyCode,


                policyName:
                    normalizedPolicy.policyName,

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









    private validatePolicy(

        policy: Partial<Policy>,

    ): {

        policyCode: string;

        policyName: string;

    } {


        if (!policy) {


            throw new Error(

                "Policy is required.",

            );


        }



        const policyCode =
            this.normalizeCode(

                policy.policyCode ?? "",

            );



        const policyName =
            typeof policy.policyName ===
            "string"

                ? policy.policyName.trim()

                : "";



        if (!policyName) {


            throw new Error(

                "Policy name is required.",

            );


        }



        return {

            policyCode,

            policyName,

        };


    }









    private normalizeCode(

        code: string,

    ): string {


        const normalizedCode =

            typeof code ===
            "string"

                ? code
                    .trim()
                    .toUpperCase()

                : "";



        if (!normalizedCode) {


            throw new Error(

                "Policy code is required.",

            );


        }



        return normalizedCode;


    }









    private validateId(

        id: string,

    ): string {


        const normalizedId =

            typeof id ===
            "string"

                ? id.trim()

                : "";



        if (!normalizedId) {


            throw new Error(

                "Policy id is required.",

            );


        }



        return normalizedId;


    }

}





export const policiesService =
    new PoliciesService();