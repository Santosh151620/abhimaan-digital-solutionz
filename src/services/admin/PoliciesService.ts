import type {
    Policy,
} from "@/types/admin/Policy";

import {
    PoliciesRepository,
} from "@/repositories/admin/PoliciesRepository";

export class PoliciesService {

    constructor(

        private readonly repository =
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

        this.validateId(
            id,
        );

        return this.repository.findById(
            id.trim(),
        );

    }

    async findByCode(

        code: string,

    ):

    Promise<Policy | null> {

        this.validateCode(
            code,
        );

        return this.repository.findByCode(

            code
                .trim()
                .toUpperCase(),

        );

    }

    async save(

        policy: Partial<Policy>,

    ):

    Promise<Policy> {

        this.validatePolicy(
            policy,
        );

        return this.repository.save({

            ...policy,

            policyCode:
                policy.policyCode!
                    .trim()
                    .toUpperCase(),

            policyName:
                policy.policyName!
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

    private validatePolicy(

        policy: Partial<Policy>,

    ): void {

        if (!policy) {

            throw new Error(
                "Policy is required.",
            );

        }

        this.validateCode(
            policy.policyCode ?? "",
        );

        if (
            !policy.policyName?.trim()
        ) {

            throw new Error(
                "Policy name is required.",
            );

        }

    }

    private validateCode(

        code: string,

    ): void {

        if (!code?.trim()) {

            throw new Error(
                "Policy code is required.",
            );

        }

    }

    private validateId(

        id: string,

    ): void {

        if (!id?.trim()) {

            throw new Error(
                "Policy id is required.",
            );

        }

    }

}

export const policiesService =
    new PoliciesService();