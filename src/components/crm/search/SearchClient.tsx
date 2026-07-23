'use client';

import { useMemo, useState } from 'react';

import SearchBar from './SearchBar';
import SearchResults from './SearchResults';

import {
    SearchServiceInstance,
} from '@/services/crm/SearchService';

import type {
    SearchResult,
} from '@/types/crm/Search';

export default function SearchClient() {

    const [
        results,
        setResults,
    ] = useState<SearchResult[]>([]);

    const total =
        useMemo(
            () => results.length,
            [results]
        );

    function handleSearch(
        query: string
    ) {

        const response =
            SearchServiceInstance.search({

                query,

            });

        setResults(
            response.results
        );

    }

    return (

        <div className="space-y-6">

            <SearchBar
                onSearch={
                    handleSearch
                }
            />

            <div className="text-sm text-muted-foreground">

                {total} result(s)

            </div>

            <SearchResults
                results={results}
            />

        </div>

    );

}