import {
    NextRequest,
    NextResponse,
} from 'next/server';


import {
    NotesServiceInstance,
} from '@/services/crm/NotesService';




interface Props {

    params: Promise<{
        id: string;
    }>;

}





export async function GET(

    request: NextRequest,

    {
        params,
    }: Props,

) {


    try {


        const {
            id,
        } =
            await params;



        const note =
            await NotesServiceInstance.findById(
                id,
            );



        if (!note) {


            return NextResponse.json(

                {
                    error:
                        'Note not found',
                },

                {
                    status: 404,
                },

            );

        }




        return NextResponse.json(
            note,
        );



    } catch {


        return NextResponse.json(

            {
                error:
                    'Failed to fetch note',
            },

            {
                status: 500,
            },

        );


    }

}








export async function PUT(

    request: NextRequest,

    {
        params,
    }: Props,

) {


    try {


        const {
            id,
        } =
            await params;



        const body =
            await request.json();




        const note =
            await NotesServiceInstance.update(

                id,

                body,

            );




        if (!note) {


            return NextResponse.json(

                {
                    error:
                        'Note not found',
                },

                {
                    status: 404,
                },

            );

        }




        return NextResponse.json(
            note,
        );



    } catch {


        return NextResponse.json(

            {
                error:
                    'Failed to update note',
            },

            {
                status: 500,
            },

        );


    }

}









export async function DELETE(

    request: NextRequest,

    {
        params,
    }: Props,

) {


    try {


        const {
            id,
        } =
            await params;



        const deleted =
            await NotesServiceInstance.delete(
                id,
            );




        if (!deleted) {


            return NextResponse.json(

                {
                    error:
                        'Note not found',
                },

                {
                    status: 404,
                },

            );

        }





        return NextResponse.json(

            {
                success:
                    true,
            },

        );



    } catch {


        return NextResponse.json(

            {
                error:
                    'Failed to delete note',
            },

            {
                status: 500,
            },

        );


    }

}