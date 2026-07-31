import {
    NextRequest,
    NextResponse,
} from "next/server";


import {
    OpportunitiesServiceInstance,
} from "@/services/crm/OpportunitiesService";


interface RouteContext {

    params: Promise<{
        id:string;
    }>;

}



export async function GET(
    _request: NextRequest,
    { params }: RouteContext,
) {

    try {

        const {
            id,
        } =
            await params;


        const opportunity =
            await OpportunitiesServiceInstance.details(
                id,
            );


        if (!opportunity) {

            return NextResponse.json(
                {
                    success:false,
                    error:
                        "Opportunity not found",
                },
                {
                    status:404,
                },
            );

        }


        return NextResponse.json(
            {
                success:true,
                data:opportunity,
            },
            {
                status:200,
            },
        );


    } catch(error) {

        console.error(
            "OPPORTUNITY_GET_ERROR",
            error,
        );


        return NextResponse.json(
            {
                success:false,
                error:
                    "Failed to fetch opportunity",
            },
            {
                status:500,
            },
        );

    }

}




export async function PATCH(
    request:NextRequest,
    { params }:RouteContext,
) {

    try {

        const {
            id,
        } =
            await params;


        const body =
            await request.json();


        const opportunity =
            await OpportunitiesServiceInstance.update(
                id,
                body,
            );


        return NextResponse.json(
            {
                success:true,
                data:opportunity,
            },
            {
                status:200,
            },
        );


    } catch(error) {

        console.error(
            "OPPORTUNITY_UPDATE_ERROR",
            error,
        );


        return NextResponse.json(
            {
                success:false,
                error:
                    "Failed to update opportunity",
            },
            {
                status:500,
            },
        );

    }

}





export async function DELETE(
    _request:NextRequest,
    { params }:RouteContext,
) {

    try {

        const {
            id,
        } =
            await params;


        await OpportunitiesServiceInstance.delete(
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


    } catch(error) {

        console.error(
            "OPPORTUNITY_DELETE_ERROR",
            error,
        );


        return NextResponse.json(
            {
                success:false,
                error:
                    "Failed to delete opportunity",
            },
            {
                status:500,
            },
        );

    }

}