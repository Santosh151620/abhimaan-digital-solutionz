import type {
    SupabaseClient,
} from "@supabase/supabase-js";

import {
    BaseRepository,
} from "@/lib/db/base-repository";

import type {
    Location,
} from "@/types/admin/Location";


type LocationRow = {

    id: string;

    organization_id: string;

    location_code: string;

    location_name: string;

    description: string | null;

    address_line1: string | null;

    address_line2: string | null;

    city: string | null;

    state: string | null;

    country: string | null;

    postal_code: string | null;

    status:
        Location["status"] |
        null;

    metadata:
        Record<string, unknown> |
        null;

    created_at: string;

    updated_at: string;

};


export interface ILocationsRepository {

    findAll(): Promise<Location[]>;

    findById(
        id: string,
    ): Promise<Location | null>;

    findByCode(
        code: string,
    ): Promise<Location | null>;

    save(
        location: Partial<Location>,
    ): Promise<Location>;

    delete(
        id: string,
    ): Promise<void>;

}


export class LocationsRepository
    extends BaseRepository<Location>
    implements ILocationsRepository
{

    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            "locations",
        );

    }


    async findAll():

    Promise<Location[]> {

        const {
            data,
            error,
        } = await this

            .tableRef()

            .select("*")

            .eq(
                "organization_id",
                this.organizationId,
            )

            .order(
                "location_name",
                {
                    ascending: true,
                },
            );


        if (error) {

            throw error;

        }


        return (data ?? []).map(
            row =>
                this.mapLocation(
                    row as LocationRow,
                ),
        );

    }


    async findById(

        id: string,

    ):

    Promise<Location | null> {

        const normalizedId =
            this.normalizeId(
                id,
            );


        const {
            data,
            error,
        } = await this

            .tableRef()

            .select("*")

            .eq(
                "organization_id",
                this.organizationId,
            )

            .eq(
                "id",
                normalizedId,
            )

            .maybeSingle();


        if (error) {

            throw error;

        }


        return data

            ? this.mapLocation(
                  data as LocationRow,
              )

            : null;

    }


    async findByCode(

        code: string,

    ):

    Promise<Location | null> {

        const normalizedCode =
            this.normalizeCode(
                code,
            );


        const {
            data,
            error,
        } = await this

            .tableRef()

            .select("*")

            .eq(
                "organization_id",
                this.organizationId,
            )

            .eq(
                "location_code",
                normalizedCode,
            )

            .maybeSingle();


        if (error) {

            throw error;

        }


        return data

            ? this.mapLocation(
                  data as LocationRow,
              )

            : null;

    }


    async save(

        location:
            Partial<Location>,

    ):

    Promise<Location> {

        if (!location) {

            throw new Error(
                "Location is required.",
            );

        }


        const locationCode =
            this.normalizeCode(
                location.locationCode,
            );


        const locationName =
            this.normalizeName(
                location.locationName,
            );


        const now =
            new Date().toISOString();


        const payload: Record<
            string,
            unknown
        > = {

            organization_id:
                this.organizationId,

            location_code:
                locationCode,

            location_name:
                locationName,

            description:
                this.normalizeDescription(
                    location.description,
                ),

            address_line1:
                this.normalizeNullableString(
                    location.addressLine1,
                ),

            address_line2:
                this.normalizeNullableString(
                    location.addressLine2,
                ),

            city:
                this.normalizeNullableString(
                    location.city,
                ),

            state:
                this.normalizeNullableString(
                    location.state,
                ),

            country:
                this.normalizeNullableString(
                    location.country,
                ),

            postal_code:
                this.normalizeNullableString(
                    location.postalCode,
                ),

            status:
                location.status ??
                "Active",

            metadata:
                location.metadata ??
                {},

            updated_at:
                now,

        };


        if (location.id) {

            payload.id =
                this.normalizeId(
                    location.id,
                );


            if (location.createdAt) {

                payload.created_at =
                    location.createdAt;

            }

        } else {

            payload.created_at =
                now;

        }


        const {
            data,
            error,
        } = await this

            .tableRef()

            .upsert(
                payload,
                {
                    onConflict: "id",
                },
            )

            .select("*")

            .single();


        if (error) {

            throw error;

        }


        if (!data) {

            throw new Error(
                "Location save returned no data.",
            );

        }


        return this.mapLocation(
            data as LocationRow,
        );

    }


    async delete(

        id: string,

    ):

    Promise<void> {

        const normalizedId =
            this.normalizeId(
                id,
            );


        await super.delete(
            normalizedId,
        );

    }


    private normalizeId(

        id: string,

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


    private normalizeName(

        name:
            string |
            undefined,

    ): string {

        const normalized =
            typeof name === "string"
                ? name.trim()
                : "";


        if (!normalized) {

            throw new Error(
                "Location name is required.",
            );

        }


        return normalized;

    }


    private normalizeNullableString(

        value:
            string |
            null |
            undefined,

    ): string | null {

        if (
            typeof value !==
            "string"
        ) {

            return null;

        }


        const normalized =
            value.trim();


        return normalized || null;

    }


    private normalizeDescription(

        description:
            string |
            null |
            undefined,

    ): string | null {

        return this.normalizeNullableString(
            description,
        );

    }


    private mapLocation(

        row: LocationRow,

    ): Location {

        return {

            id:
                row.id,

            organizationId:
                row.organization_id,

            locationCode:
                row.location_code,

            locationName:
                row.location_name,

            description:
                row.description ??
                null,

            addressLine1:
                row.address_line1 ??
                null,

            addressLine2:
                row.address_line2 ??
                null,

            city:
                row.city ??
                null,

            state:
                row.state ??
                null,

            country:
                row.country ??
                null,

            postalCode:
                row.postal_code ??
                null,

            status:
                row.status ??
                "Active",

            metadata:
                row.metadata ??
                {},

            createdAt:
                row.created_at,

            updatedAt:
                row.updated_at,

        };

    }

}