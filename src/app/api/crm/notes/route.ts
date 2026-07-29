import {
    NextRequest,
    NextResponse,
} from 'next/server';


import {
    NotesServiceInstance,
} from '@/services/crm/NotesService';




export async function GET() {

    try {

        const notes =
            await NotesServiceInstance.list();


        return NextResponse.json(
            notes,
        );


    } catch {

        return NextResponse.json(

            {
                error:
                    'Failed to fetch notes',
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


        const note =
            await NotesServiceInstance.create(
                body,
            );


        return NextResponse.json(

            note,

            {
                status: 201,
            },

        );


    } catch {

        return NextResponse.json(

            {
                error:
                    'Failed to create note',
            },

            {
                status: 500,
            },

        );

    }

}
