import { useQuery } from '@tanstack/react-query';

import {
    listContacts,
} from '@/app/crm/contacts/actions';

export function useContacts() {

    return useQuery({

        queryKey: ['contacts'],

        queryFn: listContacts,

        staleTime: 1000 * 60 * 5,

        refetchInterval: 1000 * 180,

        refetchOnWindowFocus: true,

    });

}