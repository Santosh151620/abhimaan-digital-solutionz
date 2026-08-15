import type {
    Location,
} from "@/types/admin/Location";


import {
    LocationsRepository,
} from "@/repositories/admin/LocationsRepository";



/**
 * ============================================================================
 * ADS ADMIN — LOCATIONS SERVICE
 * ============================================================================
 *
 * Canonical business-service boundary for administrative locations.
 *
 * Responsibilities:
 *
 * - Validate and normalize location input.
 * - Normalize identifiers before repository access.
 * - Enforce location-code uniqueness at the service boundary.
 * - Prevent invalid domain values from reaching persistence.
 * - Delegate persistence to LocationsRepository.
 *
 * Architecture:
 *
 *   UI / Server Action
 *          ↓
 *   LocationsService
 *          ↓
 *   LocationsRepository
 *          ↓
 *   Persistence / Supabase
 *
 * Repository responsibilities remain unchanged:
 *
 * - Database access.
 * - Tenant/security enforcement.
 * - Persistence semantics.
 * ============================================================================
 */


export class LocationsService {


    constructor(

        private readonly repository:
            LocationsRepository,

    ) {}



    /**
     * Return all locations available to the repository context.
     */
    async list():

    Promise<Location[]> {

        return this.repository.findAll();

    }



    /**
     * Find a location by identifier.
     */
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



    /**
     * Find a location by normalized business code.
     */
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



    /**
     * Create or update a location.
     *
     * The service normalizes the business fields and prevents a location
     * code from being reused by another location.
     */
    async save(

        location:
            Partial<Location>,

    ):

    Promise<Location> {

        const normalizedLocation =
            this.validateLocation(
                location,
            );


        const normalizedId =
            location.id
                ? this.validateId(
                    location.id,
                )
                : undefined;


        const existing =
            await this.repository.findByCode(

                normalizedLocation.locationCode,

            );


        if (

            existing &&

            existing.id !== normalizedId

        ) {

            throw new Error(

                "Location code already exists.",

            );

        }


        return this.repository.save(

            {

                ...location,

                ...(normalizedId
                    ? {
                        id:
                            normalizedId,
                    }
                    : {}),

                locationCode:
                    normalizedLocation.locationCode,

                locationName:
                    normalizedLocation.locationName,

            },

        );

    }



    /**
     * Delete an existing location.
     */
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



    /**
     * Validate and normalize a location payload.
     */
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



    /**
     * Normalize a location business code.
     *
     * Codes are stored and compared in uppercase form so uniqueness checks
     * remain deterministic.
     */
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


        if (

            !/^[A-Z0-9][A-Z0-9_-]*$/.test(

                normalized,

            )

        ) {

            throw new Error(

                "Location code may contain only uppercase letters, numbers, underscores, and hyphens.",

            );

        }


        return normalized;

    }



    /**
     * Normalize required textual business values.
     */
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



    /**
     * Validate and normalize an entity identifier.
     */
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