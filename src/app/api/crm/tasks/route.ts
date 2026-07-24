import {
    NextRequest,
    NextResponse,
} from 'next/server';

import {
    TasksServiceInstance,
} from '@/services/crm/TasksService';



export async function GET() {

    try {

        const tasks =
            TasksServiceInstance.list();


        return NextResponse.json(
            tasks
        );


    } catch {

        return NextResponse.json(
            {
                error:
                    'Failed to fetch tasks',
            },
            {
                status: 500,
            }
        );

    }

}




export async function POST(
    request: NextRequest
) {

    try {

        const body =
            await request.json();


        const task =
            TasksServiceInstance.create(
                body
            );


        return NextResponse.json(
            task,
            {
                status: 201,
            }
        );


    } catch {

        return NextResponse.json(
            {
                error:
                    'Failed to create task',
            },
            {
                status: 500,
            }
        );

    }

}   
