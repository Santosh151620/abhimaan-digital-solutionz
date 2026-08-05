"use client";


import {
    useState,
} from "react";



interface CsvTemplateButtonProps {

    entityType: string;

    columns?: string[];

}



export default function CsvTemplateButton({

    entityType,

    columns = [],

}: CsvTemplateButtonProps) {


    const [loading, setLoading] =
        useState(false);



    function generateCsv() {

        setLoading(true);


        try {

            const headers =
                columns.length > 0

                    ? columns

                    :

                    [
                        "Name",
                        "Email",
                        "Phone",
                    ];



            const csv =
                headers.join(",")
                +
                "\n";



            const blob =
                new Blob(

                    [
                        csv,
                    ],

                    {
                        type:
                            "text/csv;charset=utf-8;",
                    },

                );



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
                `${entityType}-Import-Template.csv`;



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

            onClick={generateCsv}

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

                    "Generating..."

                    :

                    `Download ${entityType} CSV Template`
            }


        </button>

    );

}