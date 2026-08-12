"use client";

import {
    useADSTheme,
} from "@/components/providers/ThemeProvider";


/**
 * ============================================================================
 * ADS ENTERPRISE PLATFORM
 *
 * Theme Switcher
 *
 * Production responsibilities:
 *
 * - Reads available themes from ThemeProvider.
 * - Displays the complete configured theme catalogue.
 * - Allows the authenticated UI to select a theme.
 * - Does not persist preferences directly.
 * - Does not manipulate CSS variables directly.
 * - Does not define or duplicate the ADSTheme union.
 *
 * Theme state and theme application remain owned by ThemeProvider.
 * ============================================================================
 */


export default function ThemeSwitcher() {

    const {
        theme,
        setTheme,
        themes,
    } =
        useADSTheme();


    /**
     * Derive the theme key directly from the provider's catalogue.
     *
     * This intentionally avoids importing ADSTheme from another contract.
     * ThemeProvider remains the single source of truth for available themes.
     */
    const themeEntries =
        Object.entries(
            themes,
        ) as Array<
            [
                keyof typeof themes,
                (typeof themes)[keyof typeof themes],
            ]
        >;


    return (

        <section
            className="
                space-y-4
            "
        >

            <div>

                <h3
                    className="
                        text-sm
                        font-semibold
                    "
                >
                    Theme Preference
                </h3>


                <p
                    className="
                        text-xs
                        text-muted
                    "
                >
                    Choose your personal ADS appearance.
                </p>

            </div>


            <div
                className="
                    grid
                    gap-3
                    sm:grid-cols-2
                "
            >

                {
                    themeEntries.map(
                        ([
                            key,
                            config,
                        ]) => {

                            const active =
                                theme === key;


                            return (

                                <button
                                    key={key}
                                    type="button"
                                    onClick={() =>
                                        setTheme(key)
                                    }
                                    aria-pressed={active}
                                    aria-label={
                                        `Select ${config.name} theme`
                                    }
                                    className={`
                                        rounded-xl
                                        border
                                        p-4
                                        text-left
                                        transition
                                        focus-visible:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-primary
                                        ${
                                            active
                                                ? "border-primary ring-2 ring-primary/20"
                                                : "border-border"
                                        }
                                    `}
                                >

                                    <div
                                        className="
                                            mb-3
                                            flex
                                            items-center
                                            gap-3
                                        "
                                    >

                                        <span
                                            aria-hidden="true"
                                            className="
                                                h-6
                                                w-6
                                                rounded-full
                                                border
                                                border-border
                                            "
                                            style={{
                                                background:
                                                    config.colors.primary,
                                            }}
                                        />


                                        <span
                                            className="
                                                font-medium
                                            "
                                        >
                                            {config.name}
                                        </span>

                                    </div>


                                    <div
                                        className="
                                            flex
                                            gap-2
                                        "
                                        aria-hidden="true"
                                    >

                                        <span
                                            className="
                                                h-5
                                                flex-1
                                                rounded
                                            "
                                            style={{
                                                background:
                                                    config.colors.background,
                                            }}
                                        />


                                        <span
                                            className="
                                                h-5
                                                flex-1
                                                rounded
                                            "
                                            style={{
                                                background:
                                                    config.colors.surface,
                                            }}
                                        />

                                    </div>

                                </button>

                            );

                        },
                    )
                }

            </div>

        </section>

    );

}
