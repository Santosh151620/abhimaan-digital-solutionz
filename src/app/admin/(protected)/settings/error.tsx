"use client";

import {
    useEffect,
} from "react";


interface SettingsErrorProps {

    error: Error & {
        digest?: string;
    };

    reset: () => void;

}


export default function SettingsError({

    error,

    reset,

}: SettingsErrorProps) {


    useEffect(() => {

        console.error(
            "Settings page error:",
            error,
        );

    }, [error]);



    const message =
        error.message?.trim() ||
        "An unexpected error occurred while loading settings.";



    return (

        <section
            role="alert"
            aria-labelledby="settings-error-title"
            className="
                rounded-xl
                border
                border-red-200
                bg-red-50
                p-6
                shadow-sm
            "
        >

            <div className="space-y-4">


                <div>

                    <h2
                        id="settings-error-title"
                        className="
                            text-xl
                            font-semibold
                            text-red-800
                        "
                    >
                        Unable to load Settings
                    </h2>


                    <p
                        className="
                            mt-1
                            text-sm
                            leading-6
                            text-red-700
                        "
                    >
                        Something went wrong while loading
                        the platform settings. Please try again.
                    </p>

                </div>



                <details
                    className="
                        rounded-lg
                        border
                        border-red-200
                        bg-red-100/60
                        text-sm
                        text-red-800
                    "
                >

                    <summary
                        className="
                            cursor-pointer
                            px-3
                            py-2
                            font-medium
                            select-none
                        "
                    >
                        Show error details
                    </summary>


                    <div
                        className="
                            border-t
                            border-red-200
                            px-3
                            py-3
                        "
                    >

                        <p
                            className="
                                break-words
                                font-mono
                                text-xs
                                leading-5
                            "
                        >
                            {message}
                        </p>


                        {error.digest && (

                            <p
                                className="
                                    mt-2
                                    break-all
                                    font-mono
                                    text-xs
                                    text-red-700
                                "
                            >
                                Reference: {error.digest}
                            </p>

                        )}

                    </div>

                </details>



                <div>

                    <button
                        type="button"
                        onClick={reset}
                        className="
                            rounded-md
                            bg-red-600
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-white
                            shadow-sm
                            transition
                            hover:bg-red-700
                            focus:outline-none
                            focus:ring-2
                            focus:ring-red-600
                            focus:ring-offset-2
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >
                        Try again
                    </button>

                </div>

            </div>

        </section>

    );
}