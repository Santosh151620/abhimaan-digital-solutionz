"use client";


import {
    useState,
} from "react";


import type {
    ExportRequest,
} from "@/types/crm/ImportExport";



interface ExportButtonProps {

    request: ExportRequest;

    label?: string;

}



export default function ExportButton({

    request,

    label = "Export CSV",

}: ExportButtonProps) {


    const [loading, setLoading] =
        useState(false);



    async function exportData() {


        setLoading(true);


        try {


            const response =
                await fetch(

                    "/api/crm/export",

                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                        },

                        body:
                            JSON.stringify(
                                request,
                            ),

                    },

                );



            if (!response.ok) {

                throw new Error(
                    "Export failed",
                );

            }



            const blob =
                await response.blob();



            const url =
                URL.createObjectURL(
                    blob,
                );



            const link =
                document.createElement(
                    "a",
                );


            link.href =
                url;


            link.download =
                `${request.entityType}-export.csv`;



            document.body.appendChild(
                link,
            );


            link.click();


            document.body.removeChild(
                link,
            );


            URL.revokeObjectURL(
                url,
            );


        }

        finally {

            setLoading(false);

        }


    }



    return (

        <button

            type="button"

            onClick={exportData}

            disabled={loading}

            className="
                rounded-md
                border
                px-4
                py-2
                text-sm
                hover:bg-muted
                disabled:opacity-50
            "

        >

            {
                loading

                    ?

                    "Exporting..."

                    :

                    label
            }


        </button>

    );

}