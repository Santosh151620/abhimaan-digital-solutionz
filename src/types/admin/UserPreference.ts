import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";
export type ThemePreference =
    string;
export type UserLanguage =

    | "en"

    | "hi"

    | "mr"

    | "ta"

    | "te";

export type DashboardLayout =
    Record<
        string,
        unknown
    >;
export type UserPreferenceMetadata =
    Record<
        string,
        unknown
    >;
export interface UserPreference
    extends BaseEntity {

    userId:string;

    organizationId:string;
    theme:ThemePreference;

    language:UserLanguage;
    timezone?:string;
    compactMode:boolean;

    reducedMotion:boolean;

    highContrast:boolean;

    emailNotifications:boolean;

    pushNotifications:boolean;
    systemNotifications:boolean;
    defaultLandingPage?:string;
    dashboardLayout?:DashboardLayout;
    metadata?:UserPreferenceMetadata;
}
