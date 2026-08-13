'use client';


import {
    useQuery,
} from '@tanstack/react-query';


import type {
    Company,
} from '@/types/crm/Companies';





interface UseCompaniesOptions {


    initialCompanies?: Company[];


    enabled?: boolean;


}





async function fetchCompanies(): Promise<Company[]> {


    const response =

        await fetch(

            '/api/crm/companies',

            {

                method: 'GET',

                headers: {

                    'Content-Type':
                        'application/json',

                },

                cache: 'no-store',

            }

        );





    if (!response.ok) {


        throw new Error(

            'Failed to load companies'

        );

    }





    const payload =

        await response.json();





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

        'Invalid companies response'

    );

}





export function useCompanies(

    options: UseCompaniesOptions = {},

) {


    return useQuery<Company[], Error>({


        queryKey: [

            'crm',

            'companies',

        ],



        queryFn:

            fetchCompanies,



        initialData:

            options.initialCompanies,



        enabled:

            options.enabled ?? true,



        staleTime:

            30_000,



        refetchOnWindowFocus:

            false,



    });


}