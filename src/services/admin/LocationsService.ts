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
                        .locationCode
                        .toUpperCase(),

                locationName:
                    normalizedLocation
                        .locationName
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


    private validateLocation(

        location:
            Partial<Location>,

    ): {

        locationCode: string;

        locationName: string;

    } {

        if (!location) {

            throw new Error(

                "Location is required.",

            );

        }


        const locationCode =
            typeof location.locationCode ===
            "string"
                ? location.locationCode.trim()
                : "";


        const locationName =
            typeof location.locationName ===
            "string"
                ? location.locationName.trim()
                : "";


        if (!locationCode) {

            throw new Error(

                "Location code is required.",

            );

        }


        if (!locationName) {

            throw new Error(

                "Location name is required.",

            );

        }


        return {

            locationCode,

            locationName,

        };

    }


    private validateCode(

        code: string,

    ): string {

        const normalizedCode =
            typeof code === "string"
                ? code.trim()
                : "";


        if (!normalizedCode) {

            throw new Error(

                "Location code is required.",

            );

        }


        return normalizedCode;

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