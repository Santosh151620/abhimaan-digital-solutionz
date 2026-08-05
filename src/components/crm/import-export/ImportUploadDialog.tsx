"use client";

import {
    useState,
} from "react";

import type {
    ImportExportEntityType,
    ImportExportFormat,
    ImportRequest,
} from "@/types/crm/ImportExport";


interface ImportUploadDialogProps {

    entityType:
        ImportExportEntityType;

    onSubmit?: (
        request: ImportRequest,
        file: File,
    ) => Promise<void>;

    onClose?: () => void;

}



export default function ImportUploadDialog({

    entityType,

    onSubmit,

    onClose,

}: ImportUploadDialogProps) {


    const [file, setFile] =
        useState<File | null>(
            null,
        );


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


        if (!file) {

            setError(
                "Please select a file.",
            );

            return;

        }


        setError(null);


    const content =
    await file.text();


const request: ImportRequest = {

    entityType,

    format,

    fileName:
        file.name,

    content,

    columns: [],

};


        try {

            setLoading(true);


            if (onSubmit) {

                await onSubmit(
                    request,
                    file,
                );

            }


            setFile(null);


        }

        catch (err: unknown) {


            setError(

                err instanceof Error

                    ? err.message

                    : "Import failed",

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
                    Import {entityType}
                </h2>


                <p
                    className="text-sm text-muted-foreground"
                >
                    Upload CSV, Excel or JSON data.
                </p>

            </div>



            <input

                type="file"

                accept=".csv,.xlsx,.xls,.json"

                onChange={(event) => {

                    setFile(
                        event.target.files?.[0]
                        ?? null,
                    );

                }}

            />



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
                            ? "Importing..."
                            : "Start Import"
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