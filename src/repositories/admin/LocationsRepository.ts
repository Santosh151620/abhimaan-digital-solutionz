import {
    TenantContextManager,
} from "@/lib/tenant/tenantContext";

import {
    createSupabaseServerClient,
} from "@/lib/supabase/server-client";

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
    status: Location["status"] | null;
    metadata: Record<string, unknown> | null;
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
    implements ILocationsRepository
{
    private async client() {
        return createSupabaseServerClient();
    }

    private get organizationId(): string {
        return TenantContextManager
            .require()
            .organizationId;
    }

    async findAll(): Promise<Location[]> {
        const supabase =
            await this.client();

        const {
            data,
            error,
        } = await supabase
            .from("locations")
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
            (row) =>
                this.mapLocation(
                    row as LocationRow,
                ),
        );
    }

    async findById(
        id: string,
    ): Promise<Location | null> {
        const normalizedId =
            id.trim();

        if (!normalizedId) {
            throw new Error(
                "Location id is required.",
            );
        }

        const supabase =
            await this.client();

        const {
            data,
            error,
        } = await supabase
            .from("locations")
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
    ): Promise<Location | null> {
        const normalizedCode =
            code.trim().toUpperCase();

        if (!normalizedCode) {
            throw new Error(
                "Location code is required.",
            );
        }

        const supabase =
            await this.client();

        const {
            data,
            error,
        } = await supabase
            .from("locations")
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
        location: Partial<Location>,
    ): Promise<Location> {
        const locationCode =
            location.locationCode
                ?.trim()
                .toUpperCase();

        const locationName =
            location.locationName?.trim();

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

        const supabase =
            await this.client();

        const now =
            new Date().toISOString();

        const payload = {
            id: location.id,
            organization_id:
                this.organizationId,
            location_code:
                locationCode,
            location_name:
                locationName,
            description:
                location.description ?? null,
            address_line1:
                location.addressLine1 ?? null,
            address_line2:
                location.addressLine2 ?? null,
            city:
                location.city ?? null,
            state:
                location.state ?? null,
            country:
                location.country ?? null,
            postal_code:
                location.postalCode ?? null,
            status:
                location.status ?? "Active",
            metadata:
                location.metadata ?? {},
            created_at:
                location.createdAt ?? now,
            updated_at:
                now,
        };

        const {
            data,
            error,
        } = await supabase
            .from("locations")
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

        return this.mapLocation(
            data as LocationRow,
        );
    }

    async delete(
        id: string,
    ): Promise<void> {
        const normalizedId =
            id.trim();

        if (!normalizedId) {
            throw new Error(
                "Location id is required.",
            );
        }

        const supabase =
            await this.client();

        const {
            error,
        } = await supabase
            .from("locations")
            .delete()
            .eq(
                "organization_id",
                this.organizationId,
            )
            .eq(
                "id",
                normalizedId,
            );

        if (error) {
            throw error;
        }
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
                row.description ?? null,

            addressLine1:
                row.address_line1 ?? null,

            addressLine2:
                row.address_line2 ?? null,

            city:
                row.city ?? null,

            state:
                row.state ?? null,

            country:
                row.country ?? null,

            postalCode:
                row.postal_code ?? null,

            status:
                row.status ?? "Active",

            metadata:
                row.metadata ?? {},

            createdAt:
                row.created_at,

            updatedAt:
                row.updated_at,
        };
    }
}
