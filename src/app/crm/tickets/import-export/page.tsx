'use client';

import {
    useState,
} from 'react';

import {
    exportTicketsCSV,
} from '../import-export-actions';

export default function TicketsImportExportPage() {

    const [
        exporting,
        setExporting,
    ] = useState(false);

    async function handleExport() {

        setExporting(true);

        const csv =
            await exportTicketsCSV();

        const blob =
            new Blob(
                [csv],
                {
                    type: 'text/csv',
                },
            );

        const url =
            URL.createObjectURL(
                blob,
            );

        const link =
            document.createElement(
                'a',
            );

        link.href = url;

        link.download =
            'tickets-export.csv';

        link.click();

        URL.revokeObjectURL(
            url,
        );

        setExporting(false);

    }

    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-2xl font-semibold">
                    Ticket Import / Export
                </h1>

                <p className="text-sm text-muted-foreground">
                    Import and export tickets using CSV.
                </p>

            </div>

            <div className="grid gap-6 md:grid-cols-2">

                <div className="rounded-lg border p-6">

                    <h2 className="mb-3 font-semibold">
                        Export Tickets
                    </h2>

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

                    <h2 className="mb-3 font-semibold">
                        Import Tickets
                    </h2>

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