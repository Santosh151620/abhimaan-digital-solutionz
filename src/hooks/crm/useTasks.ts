import { useQuery } from '@tanstack/react-query';

import {
    getTasks,
} from '@/app/crm/tasks/actions';


export function useTasks() {

    return useQuery({

        queryKey: [
            'tasks',
        ],

        queryFn:
            getTasks,

        staleTime:
            1000 * 60 * 5,

        refetchInterval:
            1000 * 180,

        refetchOnWindowFocus:
            true,

    });

}
