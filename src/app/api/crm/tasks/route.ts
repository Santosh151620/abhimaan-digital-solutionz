import {
    NextRequest,
    NextResponse,
} from 'next/server';


import {
    TasksServiceInstance,
} from '@/services/crm/TasksService';


import type {
    TaskSearchFilters,
    TaskPriority,
    TaskStatus,
} from '@/types/crm/Tasks';




export async function GET(
    request: NextRequest,
) {

    try {

        const searchParams =
            request.nextUrl.searchParams;


const status =
    searchParams.get('status');

const priority =
    searchParams.get('priority');


const filters: TaskSearchFilters = {

    status:
        status
            ? status as TaskStatus
            : undefined,


    priority:
        priority
            ? priority as TaskPriority
            : undefined,


    companyId:
        searchParams.get(
            'companyId',
        )
        ?? undefined,


    projectId:
        searchParams.get(
            'projectId',
        )
        ?? undefined,


    assignedTo:
        searchParams.get(
            'assignedTo',
        )
        ?? undefined,


    search:
        searchParams.get(
            'search',
        )
        ?? undefined,

};

        const hasFilters =
            Object.values(
                filters,
            )
            .some(
                value =>
                    value !== undefined
                    &&
                    value !== '',
            );



        const tasks =
            hasFilters

                ?

                await TasksServiceInstance.search(
                    filters,
                )

                :

                await TasksServiceInstance.list();



        return NextResponse.json(
            tasks,
        );


    } catch {

        return NextResponse.json(
            {
                error:
                    'Failed to fetch tasks',
            },
            {
                status: 500,
            },
        );

    }

}







export async function POST(
    request: NextRequest,
) {

    try {

        const body =
            await request.json();



        if (
            !body.title
            ||
            typeof body.title !== 'string'
        ) {

            return NextResponse.json(
                {
                    error:
                        'Task title is required',
                },
                {
                    status: 400,
                },
            );

        }



        const task =
            await TasksServiceInstance.create(
                body,
            );



        return NextResponse.json(
            task,
            {
                status: 201,
            },
        );


    } catch {

        return NextResponse.json(
            {
                error:
                    'Failed to create task',
            },
            {
                status: 500,
            },
        );

    }

}