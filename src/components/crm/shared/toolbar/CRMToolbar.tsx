'use client';

import Link from 'next/link';

interface CRMToolbarProps {

    title?: string;

    createHref?: string;

    createLabel?: string;

    searchPlaceholder?: string;

    onSearch?:
        (value: string) => void;

    children?: React.ReactNode;

}

export default function CRMToolbar({

    title,

    createHref,

    createLabel = 'New',

    searchPlaceholder = 'Search...',

    onSearch,

    children,

}: CRMToolbarProps) {

    return (

        <div className="space-y-4">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    {title && (

                        <h2 className="text-2xl font-bold">
                            {title}
                        </h2>

                    )}

                </div>

                <div className="flex flex-wrap items-center gap-2">

                    <input
                        type="search"
                        placeholder={searchPlaceholder}
                        onChange={(event) =>
                            onSearch?.(
                                event.target.value
                            )
                        }
                        className="w-64 rounded-lg border bg-background px-3 py-2"
                    />

                    <button
                        type="button"
                        className="rounded-lg border px-3 py-2"
                    >
                        Filters
                    </button>

                    <button
                        type="button"
                        className="rounded-lg border px-3 py-2"
                    >
                        Reports
                    </button>

                    <button
                        type="button"
                        className="rounded-lg border px-3 py-2"
                    >
                        Import
                    </button>

                    <button
                        type="button"
                        className="rounded-lg border px-3 py-2"
                    >
                        Export
                    </button>

                    <button
                        type="button"
                        className="rounded-lg border px-3 py-2"
                    >
                        Refresh
                    </button>

                    {createHref && (

                        <Link
                            href={createHref}
                            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                        >
                            {createLabel}
                        </Link>

                    )}

                </div>

            </div>

            {children}

        </div>

    );

}