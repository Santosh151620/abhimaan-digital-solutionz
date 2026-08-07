import type {
    Location,
} from "@/types/admin/Location";

import {
    LocationsRepository,
} from "@/repositories/admin/LocationsRepository";

export class LocationsService {

    constructor(

        private readonly repository =
            new LocationsRepository(),

    ) {}

    async list():

    Promise<Location[]> {

        return this.repository.findAll();

    }

    async findById(

        id: string,

    ):

    Promise<Location | null> {

        this.validateId(
            id,
        );

        return this.repository.findById(
            id.trim(),
        );

    }

    async save(

        location: Partial<Location>,

    ):

    Promise<Location> {

        this.validateLocation(
            location,
        );

        return this.repository.save({

            ...location,

            locationCode:
                location.locationCode!
                    .trim()
                    .toUpperCase(),

            locationName:
                location.locationName!
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

    private validateLocation(

        location: Partial<Location>,

    ): void {

        if (!location) {

            throw new Error(
                "Location is required.",
            );

        }

        if (
            !location.locationCode?.trim()
        ) {

            throw new Error(
                "Location code is required.",
            );

        }

        if (
            !location.locationName?.trim()
        ) {

            throw new Error(
                "Location name is required.",
            );

        }

    }

    private validateId(

        id: string,

    ): void {

        if (!id?.trim()) {

            throw new Error(
                "Location id is required.",
            );

        }

    }

}

export const locationsService =
    new LocationsService();