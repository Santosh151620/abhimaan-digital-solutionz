import type {
    ADSTheme,
} from "@/types/theme/Theme";

import {
    ADS_THEME_IDS,
} from "@/types/theme/Theme";

import type {
    UserPreference,
    UserLanguage,
} from "@/types/admin/UserPreference";

import type {
    IUserPreferenceRepository,
    CreateUserPreferenceInput,
    UpdateUserPreferenceInput,
} from "@/repositories/admin/UserPreferenceRepository";

import {
    UserPreferenceRepositoryInstance,
} from "@/repositories/admin/UserPreferenceRepository";


/**
 * ============================================================================
 * ADS ADMIN â€” USER PREFERENCE SERVICE
 * ============================================================================
 *
 * Business boundary for user preferences.
 *
 * Responsibilities:
 *
 * - Validate preference input.
 * - Normalize preference values.
 * - Provide safe defaults.
 * - Coordinate persistence.
 * - Keep user preferences separate from profile identity.
 *
 * Theme governance/resolution remains a separate concern.
 *
 * ============================================================================
 */


const DEFAULT_THEME: ADSTheme =
    "ads-midnight";

const DEFAULT_LANGUAGE: UserLanguage =
    "en";





const SUPPORTED_LANGUAGES:
    readonly UserLanguage[] = [

    "en",

    "hi",

    "mr",

    "ta",

    "te",

];


export interface SaveUserPreferenceInput {

    theme?: ADSTheme;

    language?: UserLanguage;

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


export interface UserPreferenceDefaults {

    theme: ADSTheme;

    language: UserLanguage;

    timezone?: string;

    compactMode: boolean;

    reducedMotion: boolean;

    highContrast: boolean;

    emailNotifications: boolean;

    pushNotifications: boolean;

    systemNotifications: boolean;

    defaultLandingPage?: string;

    dashboardLayout: Record<string, unknown>;

    metadata: Record<string, unknown>;

}


export class UserPreferenceService {


    constructor(

        private readonly repository:
            IUserPreferenceRepository =
            UserPreferenceRepositoryInstance,

    ) {}


    /**
     * ------------------------------------------------------------------------
     * Get preferences
     * ------------------------------------------------------------------------
     */

    async get(

        userId: string,

        organizationId: string,

    ): Promise<UserPreference> {


        const normalizedUserId =
            this.validateId(
                userId,
                "User",
            );


        const normalizedOrganizationId =
            this.validateId(
                organizationId,
                "Organization",
            );


        const existing =
            await this.repository.findByUserId(

                normalizedUserId,

                normalizedOrganizationId,

            );


        if (existing) {

            return existing;

        }


        return this.createDefaults(

            normalizedUserId,

            normalizedOrganizationId,

        );

    }


    /**
     * ------------------------------------------------------------------------
     * Find without creating defaults
     * ------------------------------------------------------------------------
     */

    async find(

        userId: string,

        organizationId: string,

    ): Promise<UserPreference | null> {


        const normalizedUserId =
            this.validateId(
                userId,
                "User",
            );


        const normalizedOrganizationId =
            this.validateId(
                organizationId,
                "Organization",
            );


        return this.repository.findByUserId(

            normalizedUserId,

            normalizedOrganizationId,

        );

    }


    /**
     * ------------------------------------------------------------------------
     * Create default preferences
     * ------------------------------------------------------------------------
     */

    async createDefaults(

        userId: string,

        organizationId: string,

    ): Promise<UserPreference> {


        const normalizedUserId =
            this.validateId(
                userId,
                "User",
            );


        const normalizedOrganizationId =
            this.validateId(
                organizationId,
                "Organization",
            );


        const existing =
            await this.repository.findByUserId(

                normalizedUserId,

                normalizedOrganizationId,

            );


        if (existing) {

            return existing;

        }


        const defaults =
            this.getDefaults();


        const input:
            CreateUserPreferenceInput = {

            userId:
                normalizedUserId,

            organizationId:
                normalizedOrganizationId,

            theme:
                defaults.theme,

            language:
                defaults.language,

            timezone:
                defaults.timezone,

            compactMode:
                defaults.compactMode,

            reducedMotion:
                defaults.reducedMotion,

            highContrast:
                defaults.highContrast,

            emailNotifications:
                defaults.emailNotifications,

            pushNotifications:
                defaults.pushNotifications,

            systemNotifications:
                defaults.systemNotifications,

            defaultLandingPage:
                defaults.defaultLandingPage,

            dashboardLayout:
                defaults.dashboardLayout,

            metadata:
                defaults.metadata,

        };


        return this.repository.create(
            input,
        );

    }


    /**
     * ------------------------------------------------------------------------
     * Save / upsert complete preference state
     * ------------------------------------------------------------------------
     */

    async save(

        userId: string,

        organizationId: string,

        preferences:
            SaveUserPreferenceInput,

    ): Promise<UserPreference> {


        const normalizedUserId =
            this.validateId(
                userId,
                "User",
            );


        const normalizedOrganizationId =
            this.validateId(
                organizationId,
                "Organization",
            );


        const payload =
            this.normalizePayload(
                preferences,
            );


        const existing =
            await this.repository.findByUserId(

                normalizedUserId,

                normalizedOrganizationId,

            );


        if (!existing) {

            const defaults =
                this.getDefaults();


            return this.repository.create({

                userId:
                    normalizedUserId,

                organizationId:
                    normalizedOrganizationId,

                theme:
                    payload.theme
                    ?? defaults.theme,

                language:
                    payload.language
                    ?? defaults.language,

                timezone:
                    payload.timezone
                    ?? defaults.timezone,

                compactMode:
                    payload.compactMode
                    ?? defaults.compactMode,

                reducedMotion:
                    payload.reducedMotion
                    ?? defaults.reducedMotion,

                highContrast:
                    payload.highContrast
                    ?? defaults.highContrast,

                emailNotifications:
                    payload.emailNotifications
                    ?? defaults.emailNotifications,

                pushNotifications:
                    payload.pushNotifications
                    ?? defaults.pushNotifications,

                systemNotifications:
                    payload.systemNotifications
                    ?? defaults.systemNotifications,

                defaultLandingPage:
                    payload.defaultLandingPage
                    ?? defaults.defaultLandingPage,

                dashboardLayout:
                    payload.dashboardLayout
                    ?? defaults.dashboardLayout,

                metadata:
                    payload.metadata
                    ?? defaults.metadata,

            });

        }


        return this.repository.update(

            existing.id,

            normalizedOrganizationId,

            payload,

        );

    }


    /**
     * ------------------------------------------------------------------------
     * Update individual preferences
     * ------------------------------------------------------------------------
     */

    async update(

        userId: string,

        organizationId: string,

        preferences:
            SaveUserPreferenceInput,

    ): Promise<UserPreference> {


        const normalizedUserId =
            this.validateId(
                userId,
                "User",
            );


        const normalizedOrganizationId =
            this.validateId(
                organizationId,
                "Organization",
            );


        const existing =
            await this.repository.findByUserId(

                normalizedUserId,

                normalizedOrganizationId,

            );


        if (!existing) {

            return this.save(

                normalizedUserId,

                normalizedOrganizationId,

                preferences,

            );

        }


        const payload =
            this.normalizePayload(
                preferences,
            );


        return this.repository.update(

            existing.id,

            normalizedOrganizationId,

            payload,

        );

    }


    /**
     * ------------------------------------------------------------------------
     * Theme
     * ------------------------------------------------------------------------
     */

    async getTheme(

        userId: string,

        organizationId: string,

    ): Promise<ADSTheme> {


        const preferences =
            await this.get(

                userId,

                organizationId,

            );


        return preferences.theme;

    }


    async updateTheme(

        userId: string,

        organizationId: string,

        theme: ADSTheme,

    ): Promise<UserPreference> {


        const normalizedTheme =
            this.validateTheme(
                theme,
            );


        return this.update(

            userId,

            organizationId,

            {

                theme:
                    normalizedTheme,

            },

        );

    }


    /**
     * ------------------------------------------------------------------------
     * Language
     * ------------------------------------------------------------------------
     */

    async updateLanguage(

        userId: string,

        organizationId: string,

        language: UserLanguage,

    ): Promise<UserPreference> {


        const normalizedLanguage =
            this.validateLanguage(
                language,
            );


        return this.update(

            userId,

            organizationId,

            {

                language:
                    normalizedLanguage,

            },

        );

    }


    /**
     * ------------------------------------------------------------------------
     * Defaults
     * ------------------------------------------------------------------------
     */

    getDefaults():

    UserPreferenceDefaults {


        return {

            theme:
                DEFAULT_THEME,

            language:
                DEFAULT_LANGUAGE,

            timezone:
                undefined,

            compactMode:
                false,

            reducedMotion:
                false,

            highContrast:
                false,

            emailNotifications:
                true,

            pushNotifications:
                true,

            systemNotifications:
                true,

            defaultLandingPage:
                undefined,

            dashboardLayout:
                {},

            metadata:
                {},

        };

    }


    /**
     * ------------------------------------------------------------------------
     * Validation
     * ------------------------------------------------------------------------
     */

    private normalizePayload(

        preferences:
            SaveUserPreferenceInput,

    ): UpdateUserPreferenceInput {


        if (!preferences) {

            throw new Error(
                "User preference payload is required.",
            );

        }


        const payload:
            UpdateUserPreferenceInput = {};


        if (
            preferences.theme !==
            undefined
        ) {

            payload.theme =
                this.validateTheme(
                    preferences.theme,
                );

        }


        if (
            preferences.language !==
            undefined
        ) {

            payload.language =
                this.validateLanguage(
                    preferences.language,
                );

        }


        if (
            preferences.timezone !==
            undefined
        ) {

            payload.timezone =
                this.normalizeOptionalString(
                    preferences.timezone,
                    "Timezone",
                );

        }


        if (
            preferences.compactMode !==
            undefined
        ) {

            payload.compactMode =
                this.validateBoolean(
                    preferences.compactMode,
                    "Compact mode",
                );

        }


        if (
            preferences.reducedMotion !==
            undefined
        ) {

            payload.reducedMotion =
                this.validateBoolean(
                    preferences.reducedMotion,
                    "Reduced motion",
                );

        }


        if (
            preferences.highContrast !==
            undefined
        ) {

            payload.highContrast =
                this.validateBoolean(
                    preferences.highContrast,
                    "High contrast",
                );

        }


        if (
            preferences.emailNotifications !==
            undefined
        ) {

            payload.emailNotifications =
                this.validateBoolean(
                    preferences.emailNotifications,
                    "Email notifications",
                );

        }


        if (
            preferences.pushNotifications !==
            undefined
        ) {

            payload.pushNotifications =
                this.validateBoolean(
                    preferences.pushNotifications,
                    "Push notifications",
                );

        }


        if (
            preferences.systemNotifications !==
            undefined
        ) {

            payload.systemNotifications =
                this.validateBoolean(
                    preferences.systemNotifications,
                    "System notifications",
                );

        }


        if (
            preferences.defaultLandingPage !==
            undefined
        ) {

            payload.defaultLandingPage =
                this.normalizeOptionalString(
                    preferences.defaultLandingPage,
                    "Default landing page",
                );

        }


        if (
            preferences.dashboardLayout !==
            undefined
        ) {

            payload.dashboardLayout =
                this.validateRecord(
                    preferences.dashboardLayout,
                    "Dashboard layout",
                );

        }


        if (
            preferences.metadata !==
            undefined
        ) {

            payload.metadata =
                this.validateRecord(
                    preferences.metadata,
                    "Preference metadata",
                );

        }


        return payload;

    }


    private validateTheme(
        theme: ADSTheme,
    ): ADSTheme {


        if (
            !ADS_THEME_IDS.includes(
                theme,
            )
        ) {

            throw new Error(
                `Unsupported theme: ${String(theme)}.`,
            );

        }


        return theme;

    }


    private validateLanguage(

        language: UserLanguage,

    ): UserLanguage {


        if (
            !SUPPORTED_LANGUAGES.includes(
                language,
            )
        ) {

            throw new Error(
                `Unsupported language: ${String(language)}.`,
            );

        }


        return language;

    }


    private validateBoolean(

        value: boolean,

        field: string,

    ): boolean {


        if (
            typeof value !==
            "boolean"
        ) {

            throw new Error(
                `${field} must be a boolean.`,
            );

        }


        return value;

    }


    private validateRecord(

        value: Record<string, unknown>,

        field: string,

    ): Record<string, unknown> {


        if (
            !value ||
            typeof value !== "object" ||
            Array.isArray(value)
        ) {

            throw new Error(
                `${field} must be an object.`,
            );

        }


        return value;

    }


    private normalizeOptionalString(

        value: string,

        field: string,

    ): string | undefined {


        if (
            typeof value !==
            "string"
        ) {

            throw new Error(
                `${field} must be a string.`,
            );

        }


        const normalized =
            value.trim();


        return normalized || undefined;

    }


    private validateId(

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


export const UserPreferenceServiceInstance =
    new UserPreferenceService();
