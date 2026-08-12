'use client';

import { useQuery } from '@tanstack/react-query';

import type {
    Company,
} from '@/types/crm/Companies';


interface UseCompaniesOptions {

    initialCompanies?: Company[];

}


async function fetchCompanies(): Promise<Company[]> {

    const response =
        await fetch(
            '/api/crm/companies',
        );


    if (!response.ok) {

        throw new Error(
            'Failed to load companies',
        );

    }


    const payload =
        await response.json();


    /*
     * The API returns:
     *
     * {
     *     data: Company[]
     * }
     *
     * Keep the hook tolerant of a direct array as well
     * so existing callers remain safe.
     */
    if (
        Array.isArray(payload)
    ) {

        return payload;

    }


    if (
        Array.isArray(payload?.data)
    ) {

        return payload.data;

    }


    throw new Error(
        'Invalid companies response',
    );

}


export function useCompanies(
    options: UseCompaniesOptions = {},
) {

    return useQuery<Company[], Error>({

        queryKey: [
            'companies',
        ],

        queryFn:
            fetchCompanies,

        /*
         * When the Companies page already loaded the
         * companies on the server, use that dataset
         * immediately instead of rendering an empty
         * table and fetching the same data again.
         */
        initialData:
            options.initialCompanies,

        /*
         * The server-rendered dataset is considered
         * fresh for a short period. This prevents an
         * immediate duplicate request during initial
         * navigation while still allowing normal
         * background refresh behaviour later.
         */
        staleTime:
            30_000,

    });

}