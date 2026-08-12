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


    default:{

        name:"ADS Default",

        colors:{

            background:"#090d16",

            foreground:"#f8fafc",

            primary:"#14b8a6",

            primarySoft:"#0f766e",

            surface:"#111827",

            surfaceMuted:"#1e293b",

            border:"#334155",

            muted:"#94a3b8",

        },

    },





    ocean:{

        name:"Ocean Blue",

        colors:{

            background:"#071426",

            foreground:"#f8fafc",

            primary:"#38bdf8",

            primarySoft:"#0369a1",

            surface:"#0f172a",

            surfaceMuted:"#1e293b",

            border:"#334155",

            muted:"#94a3b8",

        },

    },





    emerald:{

        name:"Emerald Business",

        colors:{

            background:"#071812",

            foreground:"#f0fdf4",

            primary:"#10b981",

            primarySoft:"#047857",

            surface:"#10231c",

            surfaceMuted:"#1f2937",

            border:"#374151",

            muted:"#9ca3af",

        },

    },





    royal:{

        name:"Royal Professional",

        colors:{

            background:"#120b24",

            foreground:"#faf5ff",

            primary:"#a855f7",

            primarySoft:"#7e22ce",

            surface:"#1e1233",

            surfaceMuted:"#312e81",

            border:"#4c1d95",

            muted:"#c4b5fd",

        },

    },


};






interface ThemeContextValue {


    theme:ADSTheme;


    setTheme:
    (
        theme:ADSTheme
    )=>void;


    themes:
    typeof ADS_THEMES;


}





const ThemeContext =
createContext<
ThemeContextValue | undefined
>(undefined);







function applyTheme(
    theme:ADSTheme,
){


    const config =
        ADS_THEMES[theme];


    const root =
        document.documentElement;




    Object.entries(
        config.colors,
    )
    .forEach(
        ([
            key,
            value,
        ])=>{


            const cssKey =
                key.replace(
                    /[A-Z]/g,
                    letter =>
                    `-${letter.toLowerCase()}`,
                );



            root.style.setProperty(
                `--${cssKey}`,
                value,
            );


        },
    );



    root.dataset.adsTheme =
        theme;


}








export default function ThemeProvider({

    children,

}:{

    children:ReactNode;

}){


    const [
        theme,
        setThemeState,
    ] =
    useState<ADSTheme>(
        "default",
    );






    useEffect(()=>{


        const stored =
            window.localStorage.getItem(
                "ads-theme",
            );



        const activeTheme =
            stored &&
            stored in ADS_THEMES

            ?

            stored as ADSTheme

            :

            "default";





        setThemeState(
            activeTheme,
        );


        applyTheme(
            activeTheme,
        );



    },[]);









    const setTheme =
    useCallback(
        (
            value:ADSTheme,
        )=>{


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



        },
        [],
    );








    const contextValue =
    useMemo(
        ()=>({

            theme,

            setTheme,

            themes:
                ADS_THEMES,

        }),

        [
            theme,
            setTheme,
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









export function useADSTheme(){


    const context =
        useContext(
            ThemeContext,
        );



    if(!context){

        throw new Error(
            "useADSTheme must be used inside ThemeProvider",
        );

    }



    return context;


}