/**
 * ============================================================================
 * ADS ENTERPRISE PLATFORM
 *
 * Theme Domain Contract
 *
 * Shared by:
 *
 * - Website
 * - CRM
 * - ERP
 * - Administrative applications
 *
 * Runtime implementation remains inside:
 *
 * src/components/providers/ThemeProvider.tsx
 *
 * This file contains only contracts.
 *
 * ============================================================================
 */


/**
 * Supported ADS application themes.
 *
 * Keep synchronized with ADS_THEMES in ThemeProvider.
 */
export type ADSTheme =

    | "default"

    | "ocean"

    | "emerald"

    | "royal";






/**
 * ============================================================================
 * Theme Color Contract
 * ============================================================================
 *
 * CSS variable compatible color tokens.
 *
 * ThemeProvider converts these values into:
 *
 * --background
 * --foreground
 * --primary
 * --primary-soft
 * --surface
 * --surface-muted
 * --border
 * --muted
 *
 * ============================================================================
 */

export interface ThemeColors {


    background:string;


    foreground:string;


    primary:string;


    primarySoft:string;


    surface:string;


    surfaceMuted:string;


    border:string;


    muted:string;


}






/**
 * ============================================================================
 * ADS Theme Configuration
 * ============================================================================
 *
 * Describes one complete application theme.
 *
 * ============================================================================
 */

export interface ThemeConfig {


    /**
     * Display name.
     */
    name:string;



    /**
     * Visual tokens.
     */
    colors:ThemeColors;


}






/**
 * ============================================================================
 * User Theme Policy
 * ============================================================================
 *
 * Used later by organization administration.
 *
 * Examples:
 *
 * - Allow user selection
 * - Force organization theme
 * - Restrict available themes
 *
 * ============================================================================
 */

export interface ThemePolicy {


    organizationId:string;



    /**
     * Theme forced by organization.
     */
    enforcedTheme?:ADSTheme;



    /**
     * Themes available to users.
     */
    allowedThemes:ADSTheme[];



    /**
     * Whether users may override organization choice.
     */
    allowUserOverride:boolean;



}