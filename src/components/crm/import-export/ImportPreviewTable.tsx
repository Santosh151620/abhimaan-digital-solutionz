"use client";


import type {
    ImportPreviewRow,
    ImportValidationError,
    ImportWarning,
} from "@/types/crm/ImportExport";



interface ImportPreviewTableProps {

    rows: ImportPreviewRow[];

    errors?: ImportValidationError[];

    warnings?: ImportWarning[];

}



export default function ImportPreviewTable({

    rows,

    errors = [],

    warnings = [],

}: ImportPreviewTableProps) {


    return (

        <div className="space-y-4">


            <div className="
                overflow-x-auto
                rounded-md
                border
            ">

                <table className="
                    min-w-full
                    text-sm
                ">

                    <thead>

                        <tr className="
                            border-b
                        ">

                            <th className="
                                px-4
                                py-2
                                text-left
                            ">

                                Row

                            </th>


                            {
                                Object.keys(
                                    rows[0]?.values ?? {},
                                )
                                .map(
                                    column => (

                                        <th

                                            key={column}

                                            className="
                                                px-4
                                                py-2
                                                text-left
                                            "

                                        >

                                            {column}

                                        </th>

                                    ),
                                )
                            }


                        </tr>

                    </thead>


                    <tbody>

                        {
                            rows.map(
                                row => (

                                    <tr

                                        key={
                                            row.rowNumber
                                        }

                                        className="
                                            border-b
                                        "

                                    >

                                        <td className="
                                            px-4
                                            py-2
                                        ">

                                            {
                                                row.rowNumber
                                            }

                                        </td>


                                        {
                                            Object.values(
                                                row.values,
                                            )
                                            .map(
                                                (
                                                    value,
                                                    index,
                                                ) => (

                                                    <td

                                                        key={
                                                            index
                                                        }

                                                        className="
                                                            px-4
                                                            py-2
                                                        "

                                                    >

                                                        {
                                                            String(
                                                                value
                                                                ??
                                                                "",
                                                            )
                                                        }

                                                    </td>

                                                ),
                                            )
                                        }


                                    </tr>

                                ),
                            )
                        }


                    </tbody>


                </table>


            </div>



            {
                errors.length > 0
                &&

                <div className="
                    rounded-md
                    border
                    p-3
                ">

                    <h4 className="font-medium">

                        Validation Errors

                    </h4>


                    {
                        errors.map(
                            error => (

                                <div

                                    key={
                                        `${error.row}-${error.column}`
                                    }

                                    className="
                                        text-sm
                                    "

                                >

                                    Row {error.row} -
                                    {" "}
                                    {error.column}
                                    :
                                    {" "}
                                    {error.message}

                                </div>

                            ),
                        )
                    }


                </div>

            }



            {
                warnings.length > 0
                &&

                <div className="
                    rounded-md
                    border
                    p-3
                ">

                    <h4 className="font-medium">

                        Warnings

                    </h4>


                    {
                        warnings.map(
                            (
                                warning,
                                index,
                            ) => (

                                <div

                                    key={index}

                                    className="
                                        text-sm
                                    "

                                >

                                    Row {warning.row}
                                    :
                                    {" "}
                                    {warning.message}

                                </div>

                            ),
                        )
                    }


                </div>

            }


        </div>

    );

}