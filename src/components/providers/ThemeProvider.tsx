"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import type {
    ReactNode,
} from "react";

import type {
    ADSTheme,
    ThemeConfig,
} from "@/types/theme/Theme";

export const ADS_THEMES:
Record<ADSTheme, ThemeConfig>
=
{
    "ads-midnight": {
        id: "ads-midnight",
        name: "ADS Midnight",
        description: "Premium dark ADS enterprise theme.",
        official: true,
        selectable: true,
        colors: {
            background: "#050914",
            foreground: "#f4f8ff",
            primary: "#168cff",
            primarySoft: "#0b5fc2",
            secondary: "#0b6fff",
            accent: "#20c8ff",
            accentSoft: "#0d7fc4",
            backgroundDeep: "#030711",
            backgroundElevated: "#07101e",
            surface: "#0b1220",
            surfaceMuted: "#111b2d",
            surfaceGlass: "rgba(9,18,34,.78)",
            surfaceGlassStrong: "rgba(8,17,31,.92)",
            surfaceHover: "#101d31",
            border: "#26354d",
            borderSubtle: "rgba(96,165,250,.16)",
            borderStrong: "rgba(37,140,255,.34)",
            textPrimary: "#f4f8ff",
            textSecondary: "#b5c4d8",
            textMuted: "#71839d",
            primaryHover: "#319bff",
            primaryActive: "#0876e8",
            info: "#38bdf8",
            cyan: "#22d3ee",
            blue: "#168cff",
            success: "#10b981",
            warning: "#f59e0b",
            danger: "#ef4444",
            muted: "#71839d",
            shadowCard: "0 12px 36px rgba(0,0,0,.28)",
            shadowGlow: "0 0 28px rgba(22,140,255,.16)",
            glassBlur: "18px",
        },
    },

    "ads-azure": {
        id: "ads-azure",
        name: "ADS Azure",
        description: "Modern blue enterprise theme.",
        official: true,
        selectable: true,
        colors: {
            background: "#07111f",
            foreground: "#f5f9ff",
            primary: "#248cff",
            primarySoft: "#1268c7",
            secondary: "#1677e8",
            accent: "#27c9ff",
            accentSoft: "#1599d5",
            backgroundDeep: "#04101d",
            backgroundElevated: "#0a192b",
            surface: "#0d1a2b",
            surfaceMuted: "#14253b",
            surfaceGlass: "rgba(13,29,48,.80)",
            surfaceGlassStrong: "rgba(10,23,39,.94)",
            surfaceHover: "#172c46",
            border: "#294563",
            borderSubtle: "rgba(86,170,255,.18)",
            borderStrong: "rgba(48,148,255,.38)",
            textPrimary: "#f5f9ff",
            textSecondary: "#b9c9dc",
            textMuted: "#788da7",
            primaryHover: "#42a0ff",
            primaryActive: "#0879e8",
            info: "#4bc8ff",
            cyan: "#2dd4ff",
            blue: "#248cff",
            success: "#10b981",
            warning: "#f59e0b",
            danger: "#ef4444",
            muted: "#788da7",
            shadowCard: "0 12px 36px rgba(0,0,0,.24)",
            shadowGlow: "0 0 30px rgba(36,140,255,.18)",
            glassBlur: "18px",
        },
    },

    "ads-platinum": {
        id: "ads-platinum",
        name: "ADS Platinum",
        description: "Premium light enterprise theme.",
        official: true,
        selectable: true,
        colors: {
            background: "#f3f6fa",
            foreground: "#142033",
            primary: "#126fe8",
            primarySoft: "#0b59b8",
            secondary: "#1769d5",
            accent: "#08a9dc",
            accentSoft: "#087da8",
            backgroundDeep: "#e8edf4",
            backgroundElevated: "#ffffff",
            surface: "#ffffff",
            surfaceMuted: "#eef3f8",
            surfaceGlass: "rgba(255,255,255,.82)",
            surfaceGlassStrong: "rgba(255,255,255,.94)",
            surfaceHover: "#e9f1fa",
            border: "#d5deea",
            borderSubtle: "rgba(37,76,120,.14)",
            borderStrong: "rgba(18,111,232,.28)",
            textPrimary: "#142033",
            textSecondary: "#42536b",
            textMuted: "#718096",
            primaryHover: "#2d84ee",
            primaryActive: "#095fc9",
            info: "#078fca",
            cyan: "#079fc8",
            blue: "#126fe8",
            success: "#10b981",
            warning: "#f59e0b",
            danger: "#ef4444",
            muted: "#718096",
            shadowCard: "0 12px 30px rgba(24,45,72,.10)",
            shadowGlow: "0 0 24px rgba(18,111,232,.12)",
            glassBlur: "18px",
        },
    },
};

interface ThemeContextValue {

    theme:
        ADSTheme;

    setTheme:
        (theme: ADSTheme) => Promise<void>;

    themes:
        typeof ADS_THEMES;

    loading:
        boolean;

    error:
        string | null;

}


const ThemeContext =
createContext<
    ThemeContextValue | undefined
>(undefined);


function applyTheme(
    theme: ADSTheme,
): void {

    if (
        typeof document ===
        "undefined"
    ) {
        return;
    }

    const root =
        document.documentElement;

    root.dataset.theme =
        theme;

    root.dataset.adsTheme =
        theme;

}


function isADSTheme(
    value: unknown,
): value is ADSTheme {

    return (
        typeof value ===
        "string" &&
        Object.prototype.hasOwnProperty.call(
            ADS_THEMES,
            value,
        )
    );

}


interface UserPreferenceResponse {

    preference?: {

        theme?:
            ADSTheme;

    };

    data?: {

        theme?:
            ADSTheme;

    };

}


async function fetchUserTheme(): Promise<ADSTheme | null> {

    const response =
        await fetch(
            "/api/admin/user-preferences",
            {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            },
        );

    if (
        !response.ok
    ) {

        throw new Error(
            `Failed to load user preferences (${response.status}).`,
        );

    }

    const payload =
        await response.json() as
            UserPreferenceResponse;

    const theme =
        payload.preference?.theme ??
        payload.data?.theme;

    return isADSTheme(
        theme,
    )
        ? theme
        : null;

}


async function persistUserTheme(
    theme: ADSTheme,
): Promise<void> {

    const response =
        await fetch(
            "/api/admin/user-preferences",
            {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body:
                    JSON.stringify({
                        theme,
                    }),
            },
        );

    if (
        !response.ok
    ) {

        let message =
            `Failed to save theme (${response.status}).`;

        try {

            const payload =
                await response.json() as {
                    error?: string;
                    message?: string;
                };

            message =
                payload.error ??
                payload.message ??
                message;

        } catch {

            // Preserve the original HTTP error.

        }

        throw new Error(
            message,
        );

    }

}


export default function ThemeProvider({
    children,
}: {
    children: ReactNode;
}) {

    const [
        theme,
        setThemeState,
    ] =
    useState<ADSTheme>(
        "ads-midnight",
    );

    const [
        loading,
        setLoading,
    ] =
    useState<boolean>(
        true,
    );

    const [
        error,
        setError,
    ] =
    useState<string | null>(
        null,
    );


    useEffect(() => {

        let cancelled =
            false;


        async function loadTheme() {

            try {

                setLoading(
                    true,
                );

                setError(
                    null,
                );


                const stored =
                    window.localStorage.getItem(
                        "ads-theme",
                    );


                const cachedTheme =
                    isADSTheme(
                        stored,
                    )
                        ? stored
                        : null;


                if (
                    cachedTheme
                ) {

                    setThemeState(
                        cachedTheme,
                    );

                    applyTheme(
                        cachedTheme,
                    );

                }


                const serverTheme =
                    await fetchUserTheme();


                if (
                    cancelled
                ) {
                    return;
                }


                const activeTheme =
                    serverTheme ??
                    cachedTheme ??
                    "ads-midnight";


                setThemeState(
                    activeTheme,
                );

                applyTheme(
                    activeTheme,
                );


                window.localStorage.setItem(
                    "ads-theme",
                    activeTheme,
                );


            } catch (
                cause
            ) {

                if (
                    cancelled
                ) {
                    return;
                }


                const message =
                    cause instanceof Error
                        ? cause.message
                        : "Failed to load user theme.";


                setError(
                    message,
                );


                const stored =
                    window.localStorage.getItem(
                        "ads-theme",
                    );


                const fallback =
                    isADSTheme(
                        stored,
                    )
                        ? stored
                        : "ads-midnight";


                setThemeState(
                    fallback,
                );

                applyTheme(
                    fallback,
                );


            } finally {

                if (
                    !cancelled
                ) {

                    setLoading(
                        false,
                    );

                }

            }

        }


        void loadTheme();


        return () => {

            cancelled =
                true;

        };

    }, []);


    const setTheme =
        useCallback(
            async (
                value: ADSTheme,
            ): Promise<void> => {

                if (
                    !isADSTheme(
                        value,
                    )
                ) {

                    return;

                }


                const previousTheme =
                    theme;


                setError(
                    null,
                );


                /*
                 * Apply immediately.
                 *
                 * The UI does not wait for the database.
                 */

                setThemeState(
                    value,
                );

                applyTheme(
                    value,
                );

                window.localStorage.setItem(
                    "ads-theme",
                    value,
                );


                try {

                    await persistUserTheme(
                        value,
                    );

                } catch (
                    cause
                ) {

                    /*
                     * Roll back if persistence failed.
                     * This prevents the UI and DB from silently
                     * diverging.
                     */

                    setThemeState(
                        previousTheme,
                    );

                    applyTheme(
                        previousTheme,
                    );

                    window.localStorage.setItem(
                        "ads-theme",
                        previousTheme,
                    );


                    const message =
                        cause instanceof Error
                            ? cause.message
                            : "Failed to save user theme.";


                    setError(
                        message,
                    );


                    throw cause;

                }

            },
            [
                theme,
            ],
        );


    const contextValue =
        useMemo(
            () => ({
                theme,
                setTheme,
                themes:
                    ADS_THEMES,
                loading,
                error,
            }),
            [
                theme,
                setTheme,
                loading,
                error,
            ],
        );


    return (
        <ThemeContext.Provider
            value={
                contextValue
            }
        >
            {children}
        </ThemeContext.Provider>
    );

}


export function useADSTheme() {

    const context =
        useContext(
            ThemeContext,
        );


    if (
        !context
    ) {

        throw new Error(
            "useADSTheme must be used inside ThemeProvider",
        );

    }


    return context;

}
