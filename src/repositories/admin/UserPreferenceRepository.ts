import type {
    UserPreference,
} from "@/types/admin/UserPreference";

import {
    createClient,
} from "@/lib/supabase/server";


/**
 * ============================================================================
 * ADS ADMIN â€” USER PREFERENCE REPOSITORY
 * ============================================================================
 *
 * Persistence boundary for:
 *
 *     user_preferences
 *
 * Responsibilities:
 *
 * - Read/write user preference records.
 * - Map database snake_case â†’ application camelCase.
 * - Preserve organization/user ownership.
 * - Avoid business-policy decisions.
 *
 * Business rules belong in UserPreferenceService.
 * Theme resolution belongs in the theme domain/runtime.
 *
 * ============================================================================
 */


interface UserPreferenceRow {

    id: string;

    user_id: string;

    organization_id: string;

    theme: string;

    language: string;

    timezone: string | null;

    compact_mode: boolean;

    reduced_motion: boolean;

    high_contrast: boolean;

    email_notifications: boolean;

    push_notifications: boolean;

    system_notifications: boolean;

    default_landing_page: string | null;

    dashboard_layout:
        Record<string, unknown>;

    metadata:
        Record<string, unknown>;

    created_at: string;

    updated_at: string;

}


export interface CreateUserPreferenceInput {

    userId: string;

    organizationId: string;

    theme: UserPreference["theme"];

    language: UserPreference["language"];

    timezone?: string;

    compactMode?: boolean;

    reducedMotion?: boolean;

    highContrast?: boolean;

    emailNotifications?: boolean;

    pushNotifications?: boolean;

    systemNotifications?: boolean;

    defaultLandingPage?: string;

    dashboardLayout?: Record<string, unknown>;

    metadata?: Record<string, unknown>;

}


export type UpdateUserPreferenceInput =
    Partial<
        Omit<
            CreateUserPreferenceInput,
            "userId" | "organizationId"
        >
    >;


export interface IUserPreferenceRepository {

    findByUserId(
        userId: string,
        organizationId: string,
    ): Promise<UserPreference | null>;

    findById(
        id: string,
        organizationId: string,
    ): Promise<UserPreference | null>;

    create(
        input: CreateUserPreferenceInput,
    ): Promise<UserPreference>;

    update(
        id: string,
        organizationId: string,
        input: UpdateUserPreferenceInput,
    ): Promise<UserPreference>;

    upsert(
        input: CreateUserPreferenceInput,
    ): Promise<UserPreference>;

    delete(
        id: string,
        organizationId: string,
    ): Promise<void>;

}


export class UserPreferenceRepository
    implements IUserPreferenceRepository {


    private readonly table =
        "user_preferences" as const;


    private async client() {

        return createClient();

    }


    async findByUserId(

        userId: string,

        organizationId: string,

    ): Promise<UserPreference | null> {


        const normalizedUserId =
            this.requireId(
                userId,
                "User",
            );


        const normalizedOrganizationId =
            this.requireId(
                organizationId,
                "Organization",
            );


        const supabase =
            await this.client();


        const {
            data,
            error,
        } = await supabase

            .from(this.table)

            .select("*")

            .eq(
                "user_id",
                normalizedUserId,
            )

            .eq(
                "organization_id",
                normalizedOrganizationId,
            )

            .maybeSingle();


        if (error) {

            throw new Error(
                `Failed to load user preferences: ${error.message}`,
            );

        }


        if (!data) {

            return null;

        }


        return this.mapRow(
            data as UserPreferenceRow,
        );

    }


    async findById(

        id: string,

        organizationId: string,

    ): Promise<UserPreference | null> {


        const normalizedId =
            this.requireId(
                id,
                "User preference",
            );


        const normalizedOrganizationId =
            this.requireId(
                organizationId,
                "Organization",
            );


        const supabase =
            await this.client();


        const {
            data,
            error,
        } = await supabase

            .from(this.table)

            .select("*")

            .eq(
                "id",
                normalizedId,
            )

            .eq(
                "organization_id",
                normalizedOrganizationId,
            )

            .maybeSingle();


        if (error) {

            throw new Error(
                `Failed to load user preference: ${error.message}`,
            );

        }


        if (!data) {

            return null;

        }


        return this.mapRow(
            data as UserPreferenceRow,
        );

    }


    async create(

        input: CreateUserPreferenceInput,

    ): Promise<UserPreference> {


        const payload =
            this.toInsertRow(
                input,
            );


        const supabase =
            await this.client();


        const {
            data,
            error,
        } = await supabase

            .from(this.table)

            .insert(payload)

            .select("*")

            .single();


        if (error) {

            throw new Error(
                `Failed to create user preferences: ${error.message}`,
            );

        }


        if (!data) {

            throw new Error(
                "User preferences were not returned after creation.",
            );

        }


        return this.mapRow(
            data as UserPreferenceRow,
        );

    }


    async update(

        id: string,

        organizationId: string,

        input: UpdateUserPreferenceInput,

    ): Promise<UserPreference> {


        const normalizedId =
            this.requireId(
                id,
                "User preference",
            );


        const normalizedOrganizationId =
            this.requireId(
                organizationId,
                "Organization",
            );


        const payload =
            this.toUpdateRow(
                input,
            );


        if (
            Object.keys(payload).length === 0
        ) {

            const existing =
                await this.findById(
                    normalizedId,
                    normalizedOrganizationId,
                );


            if (!existing) {

                throw new Error(
                    "User preference not found.",
                );

            }


            return existing;

        }


        const supabase =
            await this.client();


        const {
            data,
            error,
        } = await supabase

            .from(this.table)

            .update(payload)

            .eq(
                "id",
                normalizedId,
            )

            .eq(
                "organization_id",
                normalizedOrganizationId,
            )

            .select("*")

            .single();


        if (error) {

            throw new Error(
                `Failed to update user preferences: ${error.message}`,
            );

        }


        if (!data) {

            throw new Error(
                "User preference not found.",
            );

        }


        return this.mapRow(
            data as UserPreferenceRow,
        );

    }


    async upsert(

        input: CreateUserPreferenceInput,

    ): Promise<UserPreference> {


        const payload =
            this.toInsertRow(
                input,
            );


        const supabase =
            await this.client();


        const {
            data,
            error,
        } = await supabase

            .from(this.table)

            .upsert(

                payload,

                {
                    onConflict:
                        "organization_id,user_id",
                },

            )

            .select("*")

            .single();


        if (error) {

            throw new Error(
                `Failed to save user preferences: ${error.message}`,
            );

        }


        if (!data) {

            throw new Error(
                "User preferences were not returned after save.",
            );

        }


        return this.mapRow(
            data as UserPreferenceRow,
        );

    }


    async delete(

        id: string,

        organizationId: string,

    ): Promise<void> {


        const normalizedId =
            this.requireId(
                id,
                "User preference",
            );


        const normalizedOrganizationId =
            this.requireId(
                organizationId,
                "Organization",
            );


        const supabase =
            await this.client();


        const {
            error,
        } = await supabase

            .from(this.table)

            .delete()

            .eq(
                "id",
                normalizedId,
            )

            .eq(
                "organization_id",
                normalizedOrganizationId,
            );


        if (error) {

            throw new Error(
                `Failed to delete user preferences: ${error.message}`,
            );

        }

    }


    private mapRow(
        row: UserPreferenceRow,
    ): UserPreference {


        return {

            id:
                row.id,

            userId:
                row.user_id,

            organizationId:
                row.organization_id,

            theme:
                row.theme as UserPreference["theme"],

            language:
                row.language as UserPreference["language"],

            timezone:
                row.timezone
                ?? undefined,

            compactMode:
                row.compact_mode,

            reducedMotion:
                row.reduced_motion,

            highContrast:
                row.high_contrast,

            emailNotifications:
                row.email_notifications,

            pushNotifications:
                row.push_notifications,

            systemNotifications:
                row.system_notifications,

            defaultLandingPage:
                row.default_landing_page
                ?? undefined,

            dashboardLayout:
                row.dashboard_layout
                ?? {},

            metadata:
                row.metadata
                ?? {},

            createdAt:
                row.created_at,

            updatedAt:
                row.updated_at,

        };

    }


    private toInsertRow(
        input: CreateUserPreferenceInput,
    ) {


        const userId =
            this.requireId(
                input.userId,
                "User",
            );


        const organizationId =
            this.requireId(
                input.organizationId,
                "Organization",
            );


        return {

            user_id:
                userId,

            organization_id:
                organizationId,

            theme:
                input.theme,

            language:
                input.language,

            timezone:
                input.timezone
                ?? null,

            compact_mode:
                input.compactMode
                ?? false,

            reduced_motion:
                input.reducedMotion
                ?? false,

            high_contrast:
                input.highContrast
                ?? false,

            email_notifications:
                input.emailNotifications
                ?? true,

            push_notifications:
                input.pushNotifications
                ?? true,

            system_notifications:
                input.systemNotifications
                ?? true,

            default_landing_page:
                input.defaultLandingPage
                ?? null,

            dashboard_layout:
                input.dashboardLayout
                ?? {},

            metadata:
                input.metadata
                ?? {},

        };

    }


    private toUpdateRow(
        input: UpdateUserPreferenceInput,
    ): Record<string, unknown> {


        const payload:
            Record<string, unknown> = {};


        if (input.theme !== undefined) {

            payload.theme =
                input.theme;

        }


        if (input.language !== undefined) {

            payload.language =
                input.language;

        }


        if (input.timezone !== undefined) {

            payload.timezone =
                input.timezone
                ?? null;

        }


        if (input.compactMode !== undefined) {

            payload.compact_mode =
                input.compactMode;

        }


        if (input.reducedMotion !== undefined) {

            payload.reduced_motion =
                input.reducedMotion;

        }


        if (input.highContrast !== undefined) {

            payload.high_contrast =
                input.highContrast;

        }


        if (
            input.emailNotifications !==
            undefined
        ) {

            payload.email_notifications =
                input.emailNotifications;

        }


        if (
            input.pushNotifications !==
            undefined
        ) {

            payload.push_notifications =
                input.pushNotifications;

        }


        if (
            input.systemNotifications !==
            undefined
        ) {

            payload.system_notifications =
                input.systemNotifications;

        }


        if (
            input.defaultLandingPage !==
            undefined
        ) {

            payload.default_landing_page =
                input.defaultLandingPage
                ?? null;

        }


        if (
            input.dashboardLayout !==
            undefined
        ) {

            payload.dashboard_layout =
                input.dashboardLayout
                ?? {};

        }


        if (input.metadata !== undefined) {

            payload.metadata =
                input.metadata
                ?? {};

        }


        return payload;

    }


    private requireId(

        id: string,

        entity: string,

    ): string {


        const normalized =
            typeof id === "string"
                ? id.trim()
                : "";


        if (!normalized) {

            throw new Error(
                `${entity} id is required.`,
            );

        }


        return normalized;

    }

}


export const UserPreferenceRepositoryInstance =
    new UserPreferenceRepository();
