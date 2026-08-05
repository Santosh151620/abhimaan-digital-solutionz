"use client";


import type {
    ImportExecutionResult,
} from "@/types/crm/ImportExport";



interface ImportResultSummaryProps {

    result: ImportExecutionResult;

}



export default function ImportResultSummary({

    result,

}: ImportResultSummaryProps) {


    return (

        <div className="
            rounded-md
            border
            p-5
            space-y-4
        ">


            <div>

                <h3 className="
                    text-lg
                    font-semibold
                ">

                    Import Completed

                </h3>


                <p className="
                    text-sm
                ">

                    Execution summary

                </p>

            </div>



            <div className="
                grid
                grid-cols-2
                gap-4
            ">


                <SummaryItem

                    label="Total Rows"

                    value={
                        result.totalRows
                    }

                />


                <SummaryItem

                    label="Imported"

                    value={
                        result.importedRows
                    }

                />


                <SummaryItem

                    label="Updated"

                    value={
                        result.updatedRows
                    }

                />


                <SummaryItem

                    label="Skipped"

                    value={
                        result.skippedRows
                    }

                />


                <SummaryItem

                    label="Failed"

                    value={
                        result.failedRows
                    }

                />


                <SummaryItem

                    label="Duration"

                    value={
                        `${result.durationMs} ms`
                    }

                />


            </div>



            {
                result.errors.length > 0
                &&

                <div className="
                    rounded-md
                    border
                    p-3
                ">


                    <h4 className="
                        font-medium
                    ">

                        Errors

                    </h4>



                    {
                        result.errors.map(
                            error => (

                                <div

                                    key={
                                        `${error.row}-${error.column}`
                                    }

                                    className="
                                        text-sm
                                    "

                                >

                                    Row {error.row}
                                    {" - "}
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
                result.warnings.length > 0
                &&

                <div className="
                    rounded-md
                    border
                    p-3
                ">


                    <h4 className="
                        font-medium
                    ">

                        Warnings

                    </h4>


                    {
                        result.warnings.map(
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



function SummaryItem({

    label,

    value,

}: {

    label: string;

    value: string | number;

}) {


    return (

        <div className="
            rounded-md
            border
            p-3
        ">


            <div className="
                text-xs
            ">

                {label}

            </div>


            <div className="
                text-lg
                font-semibold
            ">

                {value}

            </div>


        </div>

    );

}