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
    PlatformSetting,
} from "@/types/admin/Settings";

import {
    SettingsRepository,
} from "@/repositories/admin/SettingsRepository";

import {
    createClient,
} from "@/lib/supabase/server";


/**
 * ============================================================================
 * ADS ADMIN — USER PREFERENCE SERVICE
 * ============================================================================
 *
 * Business/application boundary for authenticated user preferences.
 *
 * Persistence:
 *
 *     UserPreferenceService
 *             │
 *             ▼
 *     SettingsRepository
 *             │
 *             ▼
 *     organization_settings
 *
 * No dedicated user_preferences table is used.
 *
 * User-specific keys:
 *
 *     user_preferences:<userId>
 *     user_theme:<userId>
 *
 * Theme remains separately addressable because theme governance and runtime
 * theme resolution are separate concerns.
 *
 * The service:
 *
 * - validates application input;
 * - applies safe defaults;
 * - normalizes preference values;
 * - prevents arbitrary setting keys;
 * - preserves the existing UserPreference contract;
 * - delegates persistence to SettingsRepository;
 * - never trusts organization ownership from request payloads;
 * - keeps user preference persistence organization-scoped.
 *
 * ============================================================================
 */


const DEFAULT_THEME:
    ADSTheme =
        "ads-midnight";


const DEFAULT_LANGUAGE:
    UserLanguage =
        "en";


const SUPPORTED_LANGUAGES:
    readonly UserLanguage[] = [

    "en",

    "hi",

    "mr",

    "ta",

    "te",

];


/**
 * Existing organization_settings categories.
 *
 * Do not introduce an Appearance category.
 */
const THEME_CATEGORY =
    "Branding" as const;


const PREFERENCE_CATEGORY =
    "General" as const;


/**
 * ============================================================================
 * PUBLIC INPUT CONTRACT
 * ============================================================================
 */

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


/**
 * ============================================================================
 * INTERNAL PERSISTED PREFERENCE CONTRACT
 * ============================================================================
 */

interface PersistedUserPreference {

    language:
        UserLanguage;

    timezone?:
        string;

    compactMode:
        boolean;

    reducedMotion:
        boolean;

    highContrast:
        boolean;

    emailNotifications:
        boolean;

    pushNotifications:
        boolean;

    systemNotifications:
        boolean;

    defaultLandingPage?:
        string;

    dashboardLayout:
        Record<string, unknown>;

    metadata:
        Record<string, unknown>;

}


/**
 * ============================================================================
 * RESOLVED SETTING TIMESTAMPS
 * ============================================================================
 *
 * organization_settings is the source of persistence truth.
 *
 * These timestamps are retained when available so the UserPreference contract
 * does not fabricate persistence metadata on reads.
 */

interface SettingTimestamps {

    createdAt:
        string;

    updatedAt:
        string;

}


/**
 * ============================================================================
 * SERVICE
 * ============================================================================
 */

export class UserPreferenceService {


    /**
     * ------------------------------------------------------------------------
     * Repository factory
     * ------------------------------------------------------------------------
     */

    private async repository():
        Promise<SettingsRepository> {


        const supabase =
            await createClient();


        return new SettingsRepository(
            supabase,
        );

    }


    /**
     * ------------------------------------------------------------------------
     * Stable organization-scoped keys
     * ------------------------------------------------------------------------
     */

    private preferenceKey(
        userId: string,
    ): string {

        return `user_preferences:${userId}`;

    }


    private themeKey(
        userId: string,
    ): string {

        return `user_theme:${userId}`;

    }


    /**
     * ------------------------------------------------------------------------
     * Get effective preferences
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


        const repository =
            await this.repository();


        const [
            preferenceSetting,
            themeSetting,
        ] =
            await Promise.all([

                repository.find(
                    PREFERENCE_CATEGORY,
                    this.preferenceKey(
                        normalizedUserId,
                    ),
                ),

                repository.find(
                    THEME_CATEGORY,
                    this.themeKey(
                        normalizedUserId,
                    ),
                ),

            ]);


        const defaults =
            this.getDefaults();


        const persisted =
            this.readPersistedPreferences(
                preferenceSetting?.value,
            );


        const theme =
            this.readTheme(
                themeSetting?.value,
                defaults.theme,
            );


        const timestamps =
            this.resolveTimestamps(
                preferenceSetting,
                themeSetting,
            );


        return this.toUserPreference(

            normalizedUserId,

            normalizedOrganizationId,

            {

                ...defaults,

                ...persisted,

                theme,

            },

            timestamps,

        );

    }


    /**
     * ------------------------------------------------------------------------
     * Find persisted preferences without creating defaults
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


        const repository =
            await this.repository();


        const [
            preferenceSetting,
            themeSetting,
        ] =
            await Promise.all([

                repository.find(
                    PREFERENCE_CATEGORY,
                    this.preferenceKey(
                        normalizedUserId,
                    ),
                ),

                repository.find(
                    THEME_CATEGORY,
                    this.themeKey(
                        normalizedUserId,
                    ),
                ),

            ]);


        if (
            !preferenceSetting &&
            !themeSetting
        ) {

            return null;

        }


        const defaults =
            this.getDefaults();


        const persisted =
            this.readPersistedPreferences(
                preferenceSetting?.value,
            );


        const timestamps =
            this.resolveTimestamps(
                preferenceSetting,
                themeSetting,
            );


        return this.toUserPreference(

            normalizedUserId,

            normalizedOrganizationId,

            {

                ...defaults,

                ...persisted,

                theme:
                    this.readTheme(
                        themeSetting?.value,
                        defaults.theme,
                    ),

            },

            timestamps,

        );

    }


    /**
     * ------------------------------------------------------------------------
     * Persist defaults
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
            await this.find(

                normalizedUserId,

                normalizedOrganizationId,

            );


        if (existing) {

            return existing;

        }


        return this.save(

            normalizedUserId,

            normalizedOrganizationId,

            this.getDefaults(),

        );

    }


    /**
     * ------------------------------------------------------------------------
     * Save complete/effective preference state
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


        const current =
            await this.get(

                normalizedUserId,

                normalizedOrganizationId,

            );


        const defaults =
            this.getDefaults();


        const effective:
            UserPreferenceDefaults = {

            theme:
                payload.theme
                ?? current.theme
                ?? defaults.theme,

            language:
                payload.language
                ?? current.language
                ?? defaults.language,

            timezone:
                payload.timezone
                ?? current.timezone
                ?? defaults.timezone,

            compactMode:
                payload.compactMode
                ?? current.compactMode
                ?? defaults.compactMode,

            reducedMotion:
                payload.reducedMotion
                ?? current.reducedMotion
                ?? defaults.reducedMotion,

            highContrast:
                payload.highContrast
                ?? current.highContrast
                ?? defaults.highContrast,

            emailNotifications:
                payload.emailNotifications
                ?? current.emailNotifications
                ?? defaults.emailNotifications,

            pushNotifications:
                payload.pushNotifications
                ?? current.pushNotifications
                ?? defaults.pushNotifications,

            systemNotifications:
                payload.systemNotifications
                ?? current.systemNotifications
                ?? defaults.systemNotifications,

            defaultLandingPage:
                payload.defaultLandingPage
                ?? current.defaultLandingPage
                ?? defaults.defaultLandingPage,

            dashboardLayout:
                payload.dashboardLayout
                ?? defaults.dashboardLayout,

            metadata:
                payload.metadata
                ?? current.metadata
                ?? defaults.metadata,

        };


        await this.persistPreferences(

            normalizedUserId,

            normalizedOrganizationId,

            effective,

        );


        return this.get(

            normalizedUserId,

            normalizedOrganizationId,

        );

    }


    /**
     * ------------------------------------------------------------------------
     * Partial update
     * ------------------------------------------------------------------------
     */

    async update(

        userId: string,

        organizationId: string,

        preferences:
            SaveUserPreferenceInput,

    ): Promise<UserPreference> {


        return this.save(

            userId,

            organizationId,

            preferences,

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


        const normalizedTheme =
            this.validateTheme(
                theme,
            );


        const repository =
            await this.repository();


        const existing =
            await this.get(

                normalizedUserId,

                normalizedOrganizationId,

            );


        const setting =
            this.createThemeSetting(

                normalizedUserId,

                normalizedOrganizationId,

                normalizedTheme,

                existing,

            );


        await repository.save(
            setting,
        );


        return this.get(

            normalizedUserId,

            normalizedOrganizationId,

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
     * =========================================================================
     * PERSISTENCE
     * =========================================================================
     */

    private async persistPreferences(

        userId: string,

        organizationId: string,

        preferences:
            UserPreferenceDefaults,

    ): Promise<void> {


        const repository =
            await this.repository();


        const preferenceSetting =
            this.createPreferenceSetting(

                userId,

                organizationId,

                preferences,

            );


        const themeSetting =
            this.createThemeSetting(

                userId,

                organizationId,

                preferences.theme,

            );


        await Promise.all([

            repository.save(
                preferenceSetting,
            ),

            repository.save(
                themeSetting,
            ),

        ]);

    }


    /**
     * ------------------------------------------------------------------------
     * Preference setting
     * ------------------------------------------------------------------------
     */

    private createPreferenceSetting(

        userId: string,

        organizationId: string,

        preferences:
            UserPreferenceDefaults,

    ): PlatformSetting {


        const now =
            new Date().toISOString();


        return {

            id:
                this.syntheticSettingId(
                    this.preferenceKey(
                        userId,
                    ),
                ),

            organizationId:
                organizationId,

            scope:
                "User",

            category:
                PREFERENCE_CATEGORY,

            key:
                this.preferenceKey(
                    userId,
                ),

            name:
                "User Preferences",

            description:
                "Application preferences for an individual user.",

            value: {

                language:
                    preferences.language,

                timezone:
                    preferences.timezone,

                compactMode:
                    preferences.compactMode,

                reducedMotion:
                    preferences.reducedMotion,

                highContrast:
                    preferences.highContrast,

                emailNotifications:
                    preferences.emailNotifications,

                pushNotifications:
                    preferences.pushNotifications,

                systemNotifications:
                    preferences.systemNotifications,

                defaultLandingPage:
                    preferences.defaultLandingPage,

                dashboardLayout:
                    preferences.dashboardLayout,

                metadata:
                    preferences.metadata,

            } satisfies PersistedUserPreference,

            valueType:
                "Json",

            isSystem:
                false,

            isReadonly:
                false,

            isEncrypted:
                false,

            isVisible:
                false,

            defaultValue:
                undefined,

            allowedValues:
                undefined,

            validationExpression:
                undefined,

            isActive:
                true,

            createdBy:
                userId,

            updatedBy:
                userId,

            createdAt:
                now,

            updatedAt:
                now,

            metadata:
                {

                    ownerUserId:
                        userId,

                    organizationId:
                        organizationId,

                    preferenceVersion:
                        1,

                },

        };

    }


    /**
     * ------------------------------------------------------------------------
     * Theme setting
     * ------------------------------------------------------------------------
     */

    private createThemeSetting(

        userId: string,

        organizationId: string,

        theme: ADSTheme,

        existingPreference?:
            UserPreference,

    ): PlatformSetting {


        const now =
            new Date().toISOString();


        return {

            id:
                this.syntheticSettingId(
                    this.themeKey(
                        userId,
                    ),
                ),

            organizationId:
                organizationId,

            scope:
                "User",

            category:
                THEME_CATEGORY,

            key:
                this.themeKey(
                    userId,
                ),

            name:
                "User Theme",

            description:
                "Explicit theme preference for an individual user.",

            value:
                theme,

            valueType:
                "String",

            isSystem:
                false,

            isReadonly:
                false,

            isEncrypted:
                false,

            isVisible:
                false,

            defaultValue:
                DEFAULT_THEME,

            allowedValues:
                [...ADS_THEME_IDS],

            validationExpression:
                undefined,

            isActive:
                true,

            createdBy:
                userId,

            updatedBy:
                userId,

            createdAt:
                existingPreference?.createdAt
                ?? now,

            updatedAt:
                now,

            metadata:
                {

                    ownerUserId:
                        userId,

                    organizationId:
                        organizationId,

                    preferenceVersion:
                        1,

                },

        };

    }


    /**
     * =========================================================================
     * MAPPING
     * =========================================================================
     */

    private toUserPreference(

        userId: string,

        organizationId: string,

        values:
            UserPreferenceDefaults,

        timestamps:
            SettingTimestamps,

    ): UserPreference {


        return {

            id:
                this.syntheticSettingId(
                    this.preferenceKey(
                        userId,
                    ),
                ),

            userId:
                userId,

            organizationId:
                organizationId,

            theme:
                values.theme,

            language:
                values.language,

            timezone:
                values.timezone,

            compactMode:
                values.compactMode,

            reducedMotion:
                values.reducedMotion,

            highContrast:
                values.highContrast,

            emailNotifications:
                values.emailNotifications,

            pushNotifications:
                values.pushNotifications,

            systemNotifications:
                values.systemNotifications,

            defaultLandingPage:
                values.defaultLandingPage,

            metadata:
                values.metadata,

            createdAt:
                timestamps.createdAt,

            updatedAt:
                timestamps.updatedAt,

        };

    }


    /**
     * ------------------------------------------------------------------------
     * Timestamp resolution
     * ------------------------------------------------------------------------
     */

    private resolveTimestamps(

        preferenceSetting:
            PlatformSetting | null,

        themeSetting:
            PlatformSetting | null,

    ): SettingTimestamps {


        const createdAt =
            preferenceSetting?.createdAt
            ?? themeSetting?.createdAt
            ?? new Date().toISOString();


        const updatedAt =
            preferenceSetting?.updatedAt
            ?? themeSetting?.updatedAt
            ?? createdAt;


        return {

            createdAt,

            updatedAt,

        };

    }


    /**
     * =========================================================================
     * READ / MAPPING HELPERS
     * =========================================================================
     */

    private readPersistedPreferences(

        value: unknown,

    ): Partial<PersistedUserPreference> {


        if (
            !this.isRecord(
                value,
            )
        ) {

            return {};

        }


        const result:
            Partial<PersistedUserPreference> =
            {};


        if (
            this.isSupportedLanguage(
                value.language,
            )
        ) {

            result.language =
                value.language;

        }


        if (
            typeof value.timezone ===
            "string"
        ) {

            result.timezone =
                value.timezone;

        }


        if (
            typeof value.compactMode ===
            "boolean"
        ) {

            result.compactMode =
                value.compactMode;

        }


        if (
            typeof value.reducedMotion ===
            "boolean"
        ) {

            result.reducedMotion =
                value.reducedMotion;

        }


        if (
            typeof value.highContrast ===
            "boolean"
        ) {

            result.highContrast =
                value.highContrast;

        }


        if (
            typeof value.emailNotifications ===
            "boolean"
        ) {

            result.emailNotifications =
                value.emailNotifications;

        }


        if (
            typeof value.pushNotifications ===
            "boolean"
        ) {

            result.pushNotifications =
                value.pushNotifications;

        }


        if (
            typeof value.systemNotifications ===
            "boolean"
        ) {

            result.systemNotifications =
                value.systemNotifications;

        }


        if (
            typeof value.defaultLandingPage ===
            "string"
        ) {

            result.defaultLandingPage =
                value.defaultLandingPage;

        }


        if (
            this.isRecord(
                value.dashboardLayout,
            )
        ) {

            result.dashboardLayout =
                value.dashboardLayout;

        }


        if (
            this.isRecord(
                value.metadata,
            )
        ) {

            result.metadata =
                value.metadata;

        }


        return result;

    }


    private readTheme(

        value: unknown,

        fallback: ADSTheme,

    ): ADSTheme {


        if (
            this.isTheme(
                value,
            )
        ) {

            return value;

        }


        return fallback;

    }


    /**
     * =========================================================================
     * VALIDATION
     * =========================================================================
     */

    private normalizePayload(

        preferences:
            SaveUserPreferenceInput,

    ): SaveUserPreferenceInput {


        if (
            !preferences ||
            typeof preferences !== "object" ||
            Array.isArray(preferences)
        ) {

            throw new Error(
                "User preference payload is required.",
            );

        }


        const payload:
            SaveUserPreferenceInput =
            {};


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
            !this.isTheme(
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
            !this.isSupportedLanguage(
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
            !this.isRecord(
                value,
            )
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


        return normalized ||
            undefined;

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


    private isTheme(

        value: unknown,

    ): value is ADSTheme {


        return (

            typeof value === "string"

            &&

            ADS_THEME_IDS.includes(
                value as ADSTheme,
            )

        );

    }


    private isSupportedLanguage(

        value: unknown,

    ): value is UserLanguage {


        return (

            typeof value === "string"

            &&

            SUPPORTED_LANGUAGES.includes(
                value as UserLanguage,
            )

        );

    }


    private isRecord(

        value: unknown,

    ): value is Record<string, unknown> {


        return (

            !!value

            &&

            typeof value === "object"

            &&

            !Array.isArray(value)

        );

    }


    /**
     * =========================================================================
     * APPLICATION-SIDE STABLE IDENTIFIER
     * =========================================================================
     *
     * SettingsRepository persists using organization_id + setting_key.
     *
     * The current SettingsRepository contract does not persist PlatformSetting
     * id, so this identifier is only required to satisfy the application
     * contract.
     *
     * It is deliberately stable for the same logical preference key.
     */

    private syntheticSettingId(

        key: string,

    ): string {


        return `runtime:${key}`;

    }

}


/**
 * ============================================================================
 * SINGLETON
 * ============================================================================
 */

export const UserPreferenceServiceInstance =
    new UserPreferenceService();
