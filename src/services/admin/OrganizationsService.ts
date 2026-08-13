/**
 * ============================================================================
 * ADS ENTERPRISE PLATFORM
 * Organizations Service
 *
 * Enterprise Organization Management
 * Application Layer
 *
 * Responsibilities
 * - Organization lifecycle
 * - Tenant administration
 * - Organization lookup
 * - Organization management
 *
 * Production Rules
 * - Preserve repository/service boundary
 * - Normalize organization identifiers before repository calls
 * - Normalize organization codes consistently
 * - Prevent duplicate organization codes
 * - Protect system organizations from deletion
 * ============================================================================
 */


import type {
    Organization,
} from "@/types/admin/Organization";


import type {
    IOrganizationsRepository,
} from "@/repositories/admin/OrganizationsRepository";





export class OrganizationsService {





    constructor(

        private readonly repository:
            IOrganizationsRepository,

    ) {}









    async list():

    Promise<Organization[]> {


        return this.repository.list();


    }









    async active():

    Promise<Organization[]> {


        return this.repository.active();


    }









    async findById(

        id: string,

    ):

    Promise<Organization | null> {


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

    Promise<Organization | null> {


        const normalizedCode =
            this.normalizeCode(

                code,

            );



        return this.repository.findByCode(

            normalizedCode,

        );


    }









    async save(

        organization: Organization,

    ):

    Promise<void> {


        const normalizedOrganization =
            this.validateOrganization(

                organization,

            );



        const existing =
            await this.repository.findByCode(

                normalizedOrganization.code,

            );



        if (

            existing &&

            existing.id !== organization.id

        ) {


            throw new Error(

                "Organization code already exists.",

            );


        }



        await this.repository.save(

            {

                ...organization,


                code:
                    normalizedOrganization.code,


                name:
                    normalizedOrganization.name,


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



        const organization =
            await this.repository.findById(

                normalizedId,

            );



        if (!organization) {


            throw new Error(

                "Organization not found.",

            );


        }



        if (organization.isSystem) {


            throw new Error(

                "System organization cannot be deleted.",

            );


        }



        await this.repository.delete(

            normalizedId,

        );


    }









    private validateOrganization(

        organization: Organization,

    ): {

        code: string;

        name: string;

    } {


        if (!organization) {


            throw new Error(

                "Organization is required.",

            );


        }



        const name =

            typeof organization.name ===
            "string"

                ? organization.name.trim()

                : "";



        if (!name) {


            throw new Error(

                "Organization name is required.",

            );


        }



        const code =
            this.normalizeCode(

                organization.code,

            );



        if (!organization.status) {


            throw new Error(

                "Organization status is required.",

            );


        }



        return {

            code,

            name,

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

                "Organization code is required.",

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

                "Organization id is required.",

            );


        }



        return normalizedId;


    }



}