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

        id:string,

    ):

    Promise<Organization | null> {


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

    Promise<Organization | null> {


        if(!code?.trim()) {


            throw new Error(

                "Organization code is required.",

            );


        }



        return this.repository.findByCode(

            code

                .trim()

                .toUpperCase(),

        );


    }







    async save(

        organization:Organization,

    ):

    Promise<void> {



        this.validateOrganization(

            organization,

        );





        const normalizedCode =

            organization.code

                .trim()

                .toUpperCase();





        const existing =

            await this.repository.findByCode(

                normalizedCode,

            );





        if(

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

                    normalizedCode,


                name:

                    organization.name

                        .trim(),



                updatedAt:

                    new Date()

                        .toISOString(),

            },

        );


    }







    async delete(

        id:string,

    ):

    Promise<void> {


        this.validateId(

            id,

        );





        const organization =

            await this.repository.findById(

                id,

            );





        if(!organization) {


            throw new Error(

                "Organization not found.",

            );


        }





        if(organization.isSystem) {


            throw new Error(

                "System organization cannot be deleted.",

            );


        }





        await this.repository.delete(

            id,

        );


    }









    private validateOrganization(

        organization:Organization,

    ) {



        if(!organization.name?.trim()) {


            throw new Error(

                "Organization name is required.",

            );


        }







        if(!organization.code?.trim()) {


            throw new Error(

                "Organization code is required.",

            );


        }







        if(!organization.status) {


            throw new Error(

                "Organization status is required.",

            );


        }


    }









    private validateId(

        id:string,

    ) {


        if(!id?.trim()) {


            throw new Error(

                "Organization id is required.",

            );


        }


    }



}