"use client";

import {
    useState,
} from "react";


import type {
    ExportRequest,
    ImportExportEntityType,
    ImportExportFormat,
} from "@/types/crm/ImportExport";


interface ExportDialogProps {

    entityType:
        ImportExportEntityType;

    onSubmit?: (
        request: ExportRequest,
    ) => Promise<void>;

    onClose?: () => void;

}



export default function ExportDialog({

    entityType,

    onSubmit,

    onClose,

}: ExportDialogProps) {


    const [format, setFormat] =
        useState<ImportExportFormat>(
            "CSV",
        );


    const [loading, setLoading] =
        useState(false);


    const [error, setError] =
        useState<string | null>(
            null,
        );



    async function submit() {


        setLoading(true);

        setError(null);



        const request: ExportRequest = {

            entityType,

            format,

            filters: {},

        };



        try {


            if (onSubmit) {

                await onSubmit(
                    request,
                );

            }


        }

        catch (err: unknown) {


            setError(

                err instanceof Error

                    ? err.message

                    : "Export failed",

            );


        }

        finally {

            setLoading(false);

        }


    }



    return (

        <div
            className="rounded-lg border p-6 space-y-4"
        >

            <div>

                <h2
                    className="text-lg font-semibold"
                >
                    Export {entityType}
                </h2>


                <p
                    className="text-sm text-muted-foreground"
                >
                    Download CRM data.
                </p>

            </div>



            <select

                value={format}

                onChange={(event) => {

                    setFormat(
                        event.target.value as ImportExportFormat,
                    );

                }}

                className="border rounded px-3 py-2"

            >

                <option value="CSV">
                    CSV
                </option>

                <option value="Excel">
                    Excel
                </option>

                <option value="JSON">
                    JSON
                </option>


            </select>



            {
                error
                &&
                (

                    <p
                        className="text-sm text-red-600"
                    >
                        {error}
                    </p>

                )
            }



            <div
                className="flex gap-3"
            >

                <button

                    type="button"

                    disabled={loading}

                    onClick={submit}

                    className="rounded bg-primary px-4 py-2 text-white disabled:opacity-50"

                >

                    {
                        loading
                        ? "Exporting..."
                        : "Start Export"
                    }

                </button>



                {
                    onClose
                    &&
                    (

                        <button

                            type="button"

                            disabled={loading}

                            onClick={onClose}

                            className="rounded border px-4 py-2"

                        >

                            Cancel

                        </button>

                    )
                }


            </div>


        </div>

    );

}