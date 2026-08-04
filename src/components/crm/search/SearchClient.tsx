'use client';


import {
    useMemo,
    useState,
} from 'react';


import SearchBar from './SearchBar';

import SearchResults from './SearchResults';


import {
    searchAction,
} from '@/app/crm/search/actions';


import type {
    SearchResult,
} from '@/types/crm/Search';



export default function SearchClient() {


    const [
        results,
        setResults,
    ] = useState<SearchResult[]>([]);



    const [
        loading,
        setLoading,
    ] = useState(false);



    const total =
        useMemo(
            () =>
                results.length,
            [
                results,
            ],
        );



    async function handleSearch(
        query: string,
    ) {


        if (!query.trim()) {

            setResults([]);

            return;

        }



        setLoading(true);



        try {


            const response =
                await searchAction(
                    query,
                );



            setResults(
                response.results,
            );


        }

        finally {

            setLoading(false);

        }

    }



    return (

        <div className="space-y-6">


            <SearchBar

                onSearch={
                    handleSearch
                }

            />



            <div className="text-sm text-muted-foreground">


                {
                    loading
                        ? 'Searching...'
                        : `${total} result(s)`
                }


            </div>



            <SearchResults

                results={
                    results
                }

            />


        </div>

    );

}