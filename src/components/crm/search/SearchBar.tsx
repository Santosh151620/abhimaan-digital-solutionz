'use client';

import { useState } from 'react';

interface Props {

    initialQuery?: string;

    onSearch(
        query: string
    ): void;

}

export default function SearchBar({
    initialQuery = '',
    onSearch,
}: Props) {

    const [
        query,
        setQuery,
    ] = useState(
        initialQuery
    );

    function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {

        event.preventDefault();

        onSearch(
            query.trim()
        );

    }

    return (

        <form
            onSubmit={handleSubmit}
            className="flex gap-2"
        >

            <input
                type="search"
                value={query}
                placeholder="Search CRM..."
                onChange={(event) =>
                    setQuery(
                        event.target.value
                    )
                }
                className="w-full rounded-md border px-3 py-2"
            />

            <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2 text-white"
            >
                Search
            </button>

        </form>

    );

}