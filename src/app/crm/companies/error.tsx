'use client';


import {
    useEffect,
} from "react";


interface CompaniesErrorProps {

    error: Error & {
        digest?: string;
    };

    reset: () => void;

}


export default function CompaniesError({

    error,

    reset,

}: CompaniesErrorProps) {


    useEffect(() => {

        console.error(
            "Companies page error:",
            error,
        );

    }, [error]);


    return (

        <div
            role="alert"
            className="rounded-xl border border-destructive/20 bg-card p-6"
        >

            <h2 className="font-semibold text-destructive">

                Unable to load Companies

            </h2>


            <p className="mt-2 text-sm text-muted-foreground">

                Something went wrong while loading CRM companies.

                Please try again.

            </p>


            <button
                type="button"
                onClick={reset}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >

                Try Again

            </button>

        </div>

    );

}
