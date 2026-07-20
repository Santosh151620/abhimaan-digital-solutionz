'use client';

import {
    useState,
} from 'react';


import {
    exportTasksCSV,
} from '../import-export-actions';



export default function TasksImportExportPage() {


    const [
        exporting,
        setExporting,
    ] = useState(false);



    async function handleExport() {


        setExporting(true);


        const csv =
            await exportTasksCSV();



        const blob =
            new Blob(
                [
                    csv
                ],
                {
                    type:
                        'text/csv',
                }
            );



        const url =
            URL.createObjectURL(
                blob
            );



        const link =
            document.createElement(
                'a'
            );


        link.href =
            url;


        link.download =
            'tasks-export.csv';


        link.click();



        URL.revokeObjectURL(
            url
        );


        setExporting(false);

    }



    return (

        <div className="space-y-6">


            <div>

                <h1 className="text-2xl font-semibold">
                    Task Import / Export
                </h1>


                <p className="text-sm text-muted-foreground">
                    Import and export CRM tasks using CSV files.
                </p>


            </div>




            <div className="grid gap-6 md:grid-cols-2">



                <div className="rounded-lg border p-6">


                    <h2 className="font-semibold mb-3">
                        Export Tasks
                    </h2>


                    <p className="text-sm text-muted-foreground mb-4">
                        Download all tasks as CSV.
                    </p>



                    <button

                        onClick={handleExport}

                        disabled={exporting}

                        className="rounded bg-primary px-4 py-2 text-primary-foreground"

                    >

                        {
                            exporting
                                ? 'Exporting...'
                                : 'Export CSV'
                        }

                    </button>


                </div>





                <div className="rounded-lg border p-6">


                    <h2 className="font-semibold mb-3">
                        Import Tasks
                    </h2>


                    <p className="text-sm text-muted-foreground mb-4">
                        Upload CSV task data.
                    </p>


                    <input

                        type="file"

                        accept=".csv"

                        className="rounded border p-2"

                    />


                </div>



            </div>


        </div>

    );

}