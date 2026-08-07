import type {
    Designation,
} from "@/types/admin/Designation";

import type {
    IDesignationsRepository,
} from "@/repositories/admin/DesignationsRepository";

export class DesignationsService {

    constructor(
        private readonly repository:
            IDesignationsRepository,
    ) {}

    async list():
    Promise<Designation[]> {

        return this.repository.list();

    }

    async active():
    Promise<Designation[]> {

        return this.repository.active();

    }

    async findById(
        id:string,
    ):
    Promise<Designation | null> {

        this.validateId(
            id,
        );

        return this.repository.findById(
            id,
        );

    }

    async findByCode(
        code:string,
    ):
    Promise<Designation | null> {

        if(!code?.trim()) {

            throw new Error(
                "Designation code is required."
            );

        }

        return this.repository.findByCode(
            code
                .trim()
                .toUpperCase(),
        );

    }

    async search(
        keyword:string,
    ):
    Promise<Designation[]> {

        return this.repository.search(
            keyword.trim(),
        );

    }

    async save(
        designation:Designation,
    ):
    Promise<void> {

        this.validateDesignation(
            designation,
        );

        const existing =
            await this.repository.findByCode(
                designation.designationCode,
            );

        if(
            existing &&
            existing.id !== designation.id
        ) {

            throw new Error(
                "Designation code already exists."
            );

        }

        await this.repository.save({

            ...designation,

            designationCode:
                designation.designationCode
                    .trim()
                    .toUpperCase(),

            designationName:
                designation.designationName
                    .trim(),

            updatedAt:
                new Date()
                    .toISOString(),

        });

    }

    async delete(
        id:string,
    ):
    Promise<void> {

        this.validateId(
            id,
        );

        const designation =
            await this.repository.findById(
                id,
            );

        if(!designation) {

            throw new Error(
                "Designation not found."
            );

        }

        await this.repository.delete(
            id,
        );

    }

    private validateDesignation(
        designation:Designation,
    ) {

        if(
            !designation.designationCode?.trim()
        ) {

            throw new Error(
                "Designation code is required."
            );

        }

        if(
            !designation.designationName?.trim()
        ) {

            throw new Error(
                "Designation name is required."
            );

        }

        if(
            !designation.organizationId?.trim()
        ) {

            throw new Error(
                "Organization is required."
            );

        }

    }

    private validateId(
        id:string,
    ) {

        if(!id?.trim()) {

            throw new Error(
                "Designation id is required."
            );

        }

    }

}