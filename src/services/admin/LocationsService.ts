import type {
    Location,
} from "@/types/admin/Location";


import {
    LocationsRepository,
} from "@/repositories/admin/LocationsRepository";



export class LocationsService {


    constructor(

        private readonly repository:
            LocationsRepository,

    ) {}



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
            this.normalizeCode(
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
                    normalizedLocation.locationCode,

                locationName:
                    normalizedLocation.locationName,

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


        const existing =
            await this.repository.findById(

                normalizedId,

            );


        if (!existing) {

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

            typeof location !== "object" ||

            Array.isArray(location)

        ) {

            throw new Error(
                "Location is required.",
            );

        }


        return {

            locationCode:
                this.normalizeCode(
                    location.locationCode,
                ),


            locationName:
                this.normalizeRequiredText(

                    location.locationName,

                    "Location name is required.",

                ),

        };

    }



    private normalizeCode(

        code:
            string |
            undefined,

    ): string {


        const normalized =
            typeof code === "string"

                ? code
                    .trim()
                    .toUpperCase()

                : "";


        if (!normalized) {

            throw new Error(
                "Location code is required.",
            );

        }


        return normalized;

    }



    private normalizeRequiredText(

        value:
            string |
            undefined,

        message:
            string,

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

        id:
            string,

    ): string {


        const normalized =
            typeof id === "string"

                ? id.trim()

                : "";


        if (!normalized) {

            throw new Error(
                "Location id is required.",
            );

        }


        return normalized;

    }

}