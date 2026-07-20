'use client';


export default function TasksError({

    reset,

}: {

    reset:()=>void;

}) {


    return (

        <div className="rounded-lg border p-6">


            <h2 className="font-semibold">
                Unable to load Tasks
            </h2>


            <p className="mt-2 text-sm text-muted-foreground">
                Something went wrong while loading CRM tasks.
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