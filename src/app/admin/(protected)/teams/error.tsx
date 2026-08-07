"use client";


interface ErrorProps {


    error: Error;


    reset: () => void;


}



export default function Error({


    error,


    reset,


}: ErrorProps) {



    return (


        <div className="rounded-lg border border-red-200 bg-red-50 p-6">



            <h2 className="text-xl font-semibold text-red-700">

                Unable to load Teams

            </h2>





            <p className="mt-2 text-sm text-red-600">

                {error.message}

            </p>





            <button


                onClick={reset}


                className="mt-4 rounded bg-red-600 px-4 py-2 text-white"


            >

                Retry

            </button>



        </div>


    );


}