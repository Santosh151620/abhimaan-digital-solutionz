import Link from "next/link";

import {
    SettingsClient,
} from "@/components/crm/settings";

import {
    getSettings,
    getSettingsSummary,
} from "./actions";


/**
 * ============================================================================
 * CRM SETTINGS
 * ============================================================================
 *
 * Responsibilities:
 * - CRM settings landing page.
 * - Personalization entry points.
 * - Organization/system settings.
 * - Normalize the existing summary into the canonical SettingsSummary
 *   contract expected by SettingsClient.
 *
 * Persistence remains owned by the existing settings service/repository layer.
 * ============================================================================
 */


const PERSONALIZATION_OPTIONS = [

    {
        title:
            "Theme",

        description:
            "Manage CRM appearance, colors and visual preferences.",

        href:
            "/crm/settings/theme",
    },

    {
        title:
            "Profile",

        description:
            "Update profile details and account preferences.",

        href:
            "/crm/profile",
    },

    {
        title:
            "Language",

        description:
            "Configure your preferred application language.",

        href:
            "/crm/settings/language",
    },

    {
        title:
            "Accessibility",

        description:
            "Manage readability and accessibility preferences.",

        href:
            "/crm/settings/accessibility",
    },

] as const;


export default async function CRMSettingsPage() {

    const [
        settings,
        summary,
    ] =
        await Promise.all([
            getSettings(),
            getSettingsSummary(),
        ]);


    /**
     * Normalize the service summary into the canonical SettingsSummary
     * contract consumed by SettingsClient.
     *
     * The existing service already supplies:
     *
     * - total
     * - active
     * - inactive
     * - editable
     * - encrypted
     *
     * The additional aggregate fields are derived from the actual settings
     * collection rather than fabricated values.
     */
    const normalizedSummary = {

        total:
            summary.total,

        active:
            summary.active,

        inactive:
            summary.inactive,

        editable:
            summary.editable,

        encrypted:
            summary.encrypted,

        system:
            settings.filter(
                setting =>
                    setting.isSystem,
            ).length,

        categories:
            new Set(
                settings.map(
                    setting =>
                        setting.category,
                ),
            ).size,

    };


    return (

        <div
            className="
                space-y-10
            "
        >

            <section
                className="
                    space-y-3
                "
            >

                <h1
                    className="
                        crm-title
                    "
                >
                    CRM Settings
                </h1>


                <p
                    className="
                        crm-subtitle
                    "
                >
                    Manage organization configuration,
                    personalization and CRM preferences.
                </p>

            </section>


            <section
                className="
                    crm-card
                    p-8
                "
            >

                <div
                    className="
                        mb-6
                    "
                >

                    <h2
                        className="
                            text-xl
                            font-semibold
                        "
                    >
                        Personalization
                    </h2>


                    <p
                        className="
                            mt-1
                            text-sm
                            text-muted-foreground
                        "
                    >
                        Customize your CRM experience.
                    </p>

                </div>


                <div
                    className="
                        grid
                        gap-5
                        md:grid-cols-2
                        lg:grid-cols-4
                    "
                >

                    {
                        PERSONALIZATION_OPTIONS.map(
                            option => (

                                <Link
                                    key={
                                        option.title
                                    }
                                    href={
                                        option.href
                                    }
                                    className="
                                        group
                                        rounded-xl
                                        border
                                        bg-background
                                        p-5
                                        transition
                                        hover:-translate-y-1
                                        hover:shadow-md
                                    "
                                >

                                    <h3
                                        className="
                                            font-semibold
                                            group-hover:text-primary
                                        "
                                    >
                                        {option.title}
                                    </h3>


                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            text-muted-foreground
                                        "
                                    >
                                        {option.description}
                                    </p>

                                </Link>

                            ),
                        )
                    }

                </div>

            </section>


            <section
                className="
                    space-y-5
                "
            >

                <div>

                    <h2
                        className="
                            text-2xl
                            font-semibold
                        "
                    >
                        System Settings
                    </h2>


                    <p
                        className="
                            text-sm
                            text-muted-foreground
                        "
                    >
                        Configure CRM application and organization settings.
                    </p>

                </div>


                <SettingsClient
                    initialSettings={
                        settings
                    }
                    summary={
                        normalizedSummary
                    }
                />

            </section>

        </div>

    );

}