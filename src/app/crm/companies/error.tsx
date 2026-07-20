'use client';


export default function CompaniesError({

    reset,

}:{

    reset:()=>void;

}) {


    return (

        <div className="rounded border p-6">


            <h2 className="font-semibold">

                Unable to load Companies

            </h2>


            <p className="text-sm text-muted-foreground">

                Something went wrong while loading CRM companies.

            </p>



            <button

                onClick={reset}

                className="mt-4 rounded bg-primary px-4 py-2 text-primary-foreground"

            >

                Try Again

            </button>


        </div>

    );

}