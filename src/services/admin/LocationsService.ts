import type {
    Location,
} from "@/types/admin/Location";


import {
    LocationsRepository,
} from "@/repositories/admin/LocationsRepository";


import {
    createSupabaseServerClient,
} from "@/lib/supabase/server-client";



export class LocationsService {


    constructor(

        private readonly repository:
            LocationsRepository,

    ) {}



    static async create():

    Promise<LocationsService> {

        const supabase =
            await createSupabaseServerClient();


        return new LocationsService(

            new LocationsRepository(
                supabase,
            ),

        );

    }



    async list():

    Promise<Location[]> {

        return this.repository.findAll();

    }



    async findById(

        id: string,

    ):

    Promise<Location | null> {

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

    Promise<Location | null> {

        const normalizedCode =
            this.validateCode(
                code,
            );


        return this.repository.findByCode(

            normalizedCode,

        );

    }



    async save(

        location:
            Partial<Location>,

    ):

    Promise<Location> {

        const normalizedLocation =
            this.validateLocation(
                location,
            );


        return this.repository.save(

            {

                ...location,

                locationCode:
                    normalizedLocation
                        .locationCode,

                locationName:
                    normalizedLocation
                        .locationName,

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


        const location =
            await this.repository.findById(

                normalizedId,

            );


        if (!location) {

            throw new Error(

                "Location not found.",

            );

        }


        await this.repository.delete(

            normalizedId,

        );

    }



    private validateLocation(

        location:
            Partial<Location>,

    ): {

        locationCode: string;

        locationName: string;

    } {

        if (

            !location ||

            typeof location !==
                "object" ||

            Array.isArray(
                location,
            )

        ) {

            throw new Error(

                "Location is required.",

            );

        }


        const locationCode =
            this.normalizeCode(

                location.locationCode ??
                    "",

            );


        const locationName =
            this.normalizeRequiredText(

                location.locationName ??
                    "",

                "Location name is required.",

            );


        return {

            locationCode,

            locationName,

        };

    }



    private validateCode(

        code: string,

    ): string {

        return this.normalizeCode(
            code,
        );

    }



    private normalizeCode(

        code: string,

    ): string {

        const normalizedCode =
            typeof code === "string"
                ? code
                    .trim()
                    .toUpperCase()
                : "";


        if (!normalizedCode) {

            throw new Error(

                "Location code is required.",

            );

        }


        return normalizedCode;

    }



    private normalizeRequiredText(

        value: string,

        message: string,

    ): string {

        const normalized =
            typeof value === "string"
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
            typeof id === "string"
                ? id.trim()
                : "";


        if (!normalizedId) {

            throw new Error(

                "Location id is required.",

            );

        }


        return normalizedId;

    }

}