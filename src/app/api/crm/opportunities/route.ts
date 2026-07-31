import {
    NextRequest,
    NextResponse,
} from "next/server";

import {
    OpportunitiesServiceInstance,
} from "@/services/crm/OpportunitiesService";


export async function GET() {

    try {

        const opportunities =
            await OpportunitiesServiceInstance.list();


        return NextResponse.json(
            {
                success: true,
                data: opportunities,
            },
            {
                status: 200,
            },
        );


    } catch (error) {

        console.error(
            "OPPORTUNITIES_LIST_ERROR",
            error,
        );


        return NextResponse.json(
            {
                success: false,
                error:
                    "Failed to load opportunities",
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
            !body ||
            typeof body !== "object"
        ) {

            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Invalid request body",
                },
                {
                    status: 400,
                },
            );

        }


        const opportunity =
            await OpportunitiesServiceInstance.create(
                body,
            );


        return NextResponse.json(
            {
                success: true,
                data: opportunity,
            },
            {
                status: 201,
            },
        );


    } catch (error) {

        console.error(
            "OPPORTUNITY_CREATE_ERROR",
            error,
        );


        return NextResponse.json(
            {
                success: false,
                error:
                    "Failed to create opportunity",
            },
            {
                status: 500,
            },
        );

    }

}