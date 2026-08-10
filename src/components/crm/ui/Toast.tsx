"use client";

import {
    useEffect,
} from "react";

interface Props {

    title: string;

    message: string;

    type?:
        | "success"
        | "error"
        | "warning"
        | "info";

    duration?: number;

    onClose?: () => void;

}


const styles = {

    success: {
        border:
            "border-green-500",

        icon:
            "✓",
    },

    error: {
        border:
            "border-red-500",

        icon:
            "!",
    },

    warning: {
        border:
            "border-yellow-500",

        icon:
            "⚠",
    },

    info: {
        border:
            "border-blue-500",

        icon:
            "i",
    },

};


export default function Toast({

    title,

    message,

    type = "info",

    duration = 4000,

    onClose,

}: Props) {


    useEffect(() => {

        if (!onClose) {

            return;

        }


        const timer =
            window.setTimeout(
                onClose,
                duration,
            );


        return () =>
            window.clearTimeout(
                timer,
            );


    }, [
        duration,
        onClose,
    ]);



    const style =
        styles[type];


    return (

        <div

            role="alert"

            className={[
                "fixed right-6 top-6 z-50",
                "w-96 rounded-2xl",
                "border-l-4",
                "bg-white",
                "p-5",
                "shadow-xl",
                "animate-in",
                "fade-in",
                "slide-in-from-top-3",
                style.border,
            ].join(" ")}

        >

            <div
                className="flex gap-3"
            >

                <div
                    className={[
                        "flex h-8 w-8",
                        "items-center",
                        "justify-center",
                        "rounded-full",
                        "bg-slate-100",
                        "font-bold",
                    ].join(" ")}
                >

                    {style.icon}

                </div>


                <div
                    className="flex-1"
                >

                    <h3
                        className="font-semibold text-slate-900"
                    >

                        {title}

                    </h3>


                    <p
                        className="mt-1 text-sm text-slate-600"
                    >

                        {message}

                    </p>


                </div>


                {
                    onClose && (

                        <button

                            type="button"

                            onClick={onClose}

                            aria-label="Close notification"

                            className="text-slate-400 hover:text-slate-700"

                        >

                            ×

                        </button>

                    )
                }


            </div>

        </div>

    );

}