/**
 * ============================================================================
 * ADS ENTERPRISE PLATFORM
 *
 * User Preference Contract
 *
 * Runtime / Application Preference Model
 *
 * B03 / B04
 *
 * IMPORTANT
 * ============================================================================
 *
 * UserPreference is an application contract.
 *
 * It is NOT a database entity.
 *
 * User-specific preferences are persisted through the existing:
 *
 *     organization_settings
 *
 * infrastructure.
 *
 * The effective preference is resolved from:
 *
 *     Organization Settings
 *          +
 *     User-specific setting
 *
 * Theme governance remains separate from user preference storage.
 *
 * Example user-scoped setting key:
 *
 *     user_theme:<profileId>
 *
 * Do NOT introduce:
 *
 *     user_preferences
 *     user_preferences repository
 *     user_preferences service persistence
 *
 * unless the architecture is explicitly changed later.
 * ============================================================================
 */

import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";

import type {
    ADSTheme,
} from "@/types/theme/Theme";


/**
 * ============================================================================
 * Theme Preference
 * ============================================================================
 *
 * Canonical ADS theme contract.
 */
export type ThemePreference =
    ADSTheme;


/**
 * ============================================================================
 * Supported User Languages
 * ============================================================================
 *
 * Must remain aligned with next-intl/application locale configuration.
 */
export type UserLanguage =
    | "en"
    | "hi"
    | "mr"
    | "ta"
    | "te";


/**
 * ============================================================================
 * Dashboard Layout
 * ============================================================================
 */
export type DashboardLayout =
    Record<
        string,
        unknown
    >;


/**
 * ============================================================================
 * User Preference Metadata
 * ============================================================================
 */
export type UserPreferenceMetadata =
    Record<
        string,
        unknown
    >;


/**
 * ============================================================================
 * User Preference
 * ============================================================================
 *
 * Effective application preference contract.
 *
 * This is deliberately a read/application model and NOT a persistence
 * entity. Persistence belongs to the existing settings infrastructure.
 * ============================================================================
 */
export interface UserPreference
    extends BaseEntity {

    /**
     * User/profile ownership.
     */
    userId: string;


    /**
     * Organization context.
     */
    organizationId: string;


    /**
     * Effective theme.
     *
     * Theme governance is resolved separately by the theme domain.
     */
    theme: ThemePreference;


    /**
     * User locale.
     */
    language: UserLanguage;


    /**
     * Optional IANA timezone.
     */
    timezone?: string;


    /**
     * Display/accessibility preferences.
     */
    compactMode: boolean;

    reducedMotion: boolean;

    highContrast: boolean;


    /**
     * Notification preferences.
     */
    emailNotifications: boolean;

    pushNotifications: boolean;

    systemNotifications: boolean;


    /**
     * Default application landing page.
     */
    defaultLandingPage?: string;


    /**
     * User dashboard layout.
     *
     * This remains an application contract only.
     *
     * If persisted, it must use the existing organization_settings
     * infrastructure rather than a user_preferences table.
     */
    dashboardLayout?: DashboardLayout;


    /**
     * Extensible application metadata.
     */
    metadata?: UserPreferenceMetadata;
}