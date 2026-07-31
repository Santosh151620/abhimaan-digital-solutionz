import {
    NextResponse,
} from "next/server";


import {
    ContactsServiceInstance,
} from "@/services/crm/ContactsService";




interface RouteContext {

    params:
        Promise<{
            id:string;
        }>;

}







export async function GET(

    request:Request,

    {
        params,
    }:RouteContext,

) {


    try {


        const {
            id,
        } =
            await params;



        const contact =
            await ContactsServiceInstance.details(
                id,
            );



        if(!contact) {


            return NextResponse.json(

                {
                    error:
                        "Contact not found.",
                },

                {
                    status:404,
                },

            );

        }



        return NextResponse.json(

            {
                data:contact,
            },

            {
                status:200,
            },

        );



    } catch {


        return NextResponse.json(

            {
                error:
                    "Failed to load contact.",
            },

            {
                status:500,
            },

        );

    }


}







export async function PUT(

    request:Request,

    {
        params,
    }:RouteContext,

) {


    try {


        const {
            id,
        } =
            await params;



        const body =
            await request.json();



        const contact =
            await ContactsServiceInstance.update(

                id,

                body,

            );



        return NextResponse.json(

            {
                data:contact,
            },

            {
                status:200,
            },

        );



    } catch {


        return NextResponse.json(

            {
                error:
                    "Failed to update contact.",
            },

            {
                status:500,
            },

        );

    }


}







export async function PATCH(

    request:Request,

    {
        params,
    }:RouteContext,

) {


    try {


        const {
            id,
        } =
            await params;



        const body =
            await request.json();



        if(body.restore === true) {


            const restored =
                await ContactsServiceInstance.restore(
                    id,
                );



            return NextResponse.json(

                {
                    success:
                        restored,
                },

                {
                    status:200,
                },

            );

        }

        return NextResponse.json(

            {
                error:
                    "Unsupported patch operation.",
            },

            {
                status:400,
            },
        );

    } catch {
        return NextResponse.json(

            {
                error:
                    "Failed to process request.",
            },

            {
                status:500,
            },
        );
    }
}

export async function DELETE(
    request:Request,

    {
        params,
    }:RouteContext,

) {

    try {
        const {
            id,
        } =
            await params;
        await ContactsServiceInstance.delete(
            id,
        );

        return NextResponse.json(
            {
                success:true,
            },

            {
                status:200,
            },
        );

    } catch {

        return NextResponse.json(
            {
                error:
                    "Failed to delete contact.",
            },
            {
                status:500,
            },
        );
    }
}