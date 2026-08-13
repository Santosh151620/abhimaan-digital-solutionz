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

        id: string,

    ):

    Promise<Designation | null> {

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

    Promise<Designation | null> {

        const normalizedCode =
            this.normalizeCode(
                code,
            );


        return this.repository.findByCode(

            normalizedCode,

        );

    }


    async search(

        keyword: string,

    ):

    Promise<Designation[]> {

        const normalizedKeyword =
            this.normalizeSearchKeyword(
                keyword,
            );


        return this.repository.search(

            normalizedKeyword,

        );

    }


    async save(

        designation: Designation,

    ):

    Promise<void> {

        const normalizedDesignation =
            this.validateDesignation(
                designation,
            );


        const existing =
            await this.repository.findByCode(

                normalizedDesignation
                    .designationCode,

            );


        if (

            existing &&

            existing.id !==
                designation.id

        ) {

            throw new Error(
                "Designation code already exists.",
            );

        }


        await this.repository.save(

            {

                ...designation,

                designationCode:
                    normalizedDesignation
                        .designationCode,

                designationName:
                    normalizedDesignation
                        .designationName,

                organizationId:
                    designation.organizationId
                        .trim(),

                updatedAt:
                    new Date()
                        .toISOString(),

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


        const designation =
            await this.repository.findById(

                normalizedId,

            );


        if (!designation) {

            throw new Error(
                "Designation not found.",
            );

        }


        await this.repository.delete(

            normalizedId,

        );

    }


    private validateDesignation(

        designation: Designation,

    ): {

        designationCode: string;

        designationName: string;

    } {

        if (!designation) {

            throw new Error(
                "Designation is required.",
            );

        }


        const designationCode =
            this.normalizeCode(
                designation.designationCode,
            );


        const designationName =
            this.normalizeRequiredText(

                designation.designationName,

                "Designation name is required.",

            );


        if (
            typeof designation.organizationId !==
                "string" ||
            !designation.organizationId.trim()
        ) {

            throw new Error(
                "Organization is required.",
            );

        }


        return {

            designationCode,

            designationName,

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
                "Designation code is required.",
            );

        }


        return normalizedCode;

    }


    private normalizeSearchKeyword(

        keyword: string,

    ): string {

        const normalizedKeyword =
            typeof keyword ===
                "string"

                ? keyword.trim()

                : "";


        if (!normalizedKeyword) {

            throw new Error(
                "Designation search keyword is required.",
            );

        }


        return normalizedKeyword;

    }


    private normalizeRequiredText(

        value: string,

        message: string,

    ): string {

        const normalized =
            typeof value ===
                "string"

                ? value.trim()

                : "";


        if (!normalized) {

            throw new Error(
                message,
            );

        }


        return normalized;

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
                "Designation id is required.",
            );

        }


        return normalizedId;

    }

}