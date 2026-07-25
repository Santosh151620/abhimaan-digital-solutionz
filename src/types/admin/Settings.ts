/**
 * ============================================================================
 * Platform Settings
 * ============================================================================
 */

export interface BrandingSettings {

    companyName: string;

    logoUrl?: string;

    faviconUrl?: string;

    primaryColor?: string;

    secondaryColor?: string;

}

export interface SecuritySettings {

    sessionTimeoutMinutes: number;

    passwordExpiryDays?: number;

    twoFactorAuthentication: boolean;

    allowPasswordReset: boolean;

}

export interface EmailSettings {

    senderName: string;

    senderEmail: string;

    replyToEmail?: string;

}

export interface LocalizationSettings {

    timezone: string;

    locale: string;

    currency: string;

    dateFormat: string;

}

export interface PlatformSettings {

    branding: BrandingSettings;

    security: SecuritySettings;

    email: EmailSettings;

    localization: LocalizationSettings;

}