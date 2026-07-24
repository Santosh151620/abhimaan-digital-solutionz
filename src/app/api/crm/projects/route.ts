import {
    NextRequest,
    NextResponse,
} from 'next/server';

import {
    ProjectsServiceInstance,
} from '@/services/crm/ProjectsService';



export async function GET() {

    try {

        const projects =
            ProjectsServiceInstance.list();


        return NextResponse.json(
            projects
        );


    } catch (error) {

        return NextResponse.json(
            {
                error:
                    'Failed to fetch projects',
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


        const project =
            ProjectsServiceInstance.create(
                body
            );


        return NextResponse.json(
            project,
            {
                status: 201,
            }
        );


    } catch (error) {

        return NextResponse.json(
            {
                error:
                    'Failed to create project',
            },
            {
                status: 500,
            }
        );

    }

}