import {
    NextRequest,
    NextResponse,
} from "next/server";


import {
    OpportunitiesServiceInstance,
} from "@/services/crm/OpportunitiesService";


import type {
    UpdateOpportunityInput,
} from "@/types/crm/Opportunities";


import {
    withTenantRequest,
} from "@/lib/tenant/withTenantRequest";


interface RouteContext {

    params:
        Promise<{
            id: string;
        }>;

}


function getId(
    value: string | undefined,
): string | null {

    const id =
        value?.trim();

    return id || null;

}


export async function GET(
    request: NextRequest,
    context: RouteContext,
) {

    return withTenantRequest(
        request,
        async () => {

            try {

                const {
                    id,
                } =
                    await context.params;


                const opportunityId =
                    getId(id);


                if (!opportunityId) {

                    return NextResponse.json(
                        {
                            success: false,
                            error:
                                "Opportunity id is required.",
                        },
                        {
                            status: 400,
                        },
                    );

                }


                const opportunity =
                    await OpportunitiesServiceInstance.details(
                        opportunityId,
                    );


                if (!opportunity) {

                    return NextResponse.json(
                        {
                            success: false,
                            error:
                                "Opportunity not found.",
                        },
                        {
                            status: 404,
                        },
                    );

                }


                return NextResponse.json(
                    {
                        success: true,
                        data: opportunity,
                    },
                    {
                        status: 200,
                    },
                );

            } catch (error) {

                console.error(
                    "OPPORTUNITY_GET_ERROR",
                    error,
                );


                return NextResponse.json(
                    {
                        success: false,
                        error:
                            "Failed to load opportunity.",
                    },
                    {
                        status: 500,
                    },
                );

            }

        },
    );

}


export async function PUT(
    request: NextRequest,
    context: RouteContext,
) {

    return withTenantRequest(
        request,
        async () => {

            try {

                const {
                    id,
                } =
                    await context.params;


                const opportunityId =
                    getId(id);


                if (!opportunityId) {

                    return NextResponse.json(
                        {
                            success: false,
                            error:
                                "Opportunity id is required.",
                        },
                        {
                            status: 400,
                        },
                    );

                }


                const body =
                    await request.json();


                if (
                    !body
                    ||
                    typeof body !== "object"
                    ||
                    Array.isArray(body)
                ) {

                    return NextResponse.json(
                        {
                            success: false,
                            error:
                                "Invalid request body.",
                        },
                        {
                            status: 400,
                        },
                    );

                }


                const values =
                    body as UpdateOpportunityInput;


                if (
                    values.name !== undefined
                    &&
                    typeof values.name !== "string"
                ) {

                    return NextResponse.json(
                        {
                            success: false,
                            error:
                                "Opportunity name must be a string.",
                        },
                        {
                            status: 400,
                        },
                    );

                }


                if (
                    values.title !== undefined
                    &&
                    typeof values.title !== "string"
                ) {

                    return NextResponse.json(
                        {
                            success: false,
                            error:
                                "Opportunity title must be a string.",
                        },
                        {
                            status: 400,
                        },
                    );

                }


                if (
                    values.value !== undefined
                    &&
                    (
                        typeof values.value !== "number"
                        ||
                        !Number.isFinite(
                            values.value,
                        )
                        ||
                        values.value < 0
                    )
                ) {

                    return NextResponse.json(
                        {
                            success: false,
                            error:
                                "Opportunity value must be a non-negative number.",
                        },
                        {
                            status: 400,
                        },
                    );

                }


                if (
                    values.probability !== undefined
                    &&
                    (
                        typeof values.probability !== "number"
                        ||
                        !Number.isFinite(
                            values.probability,
                        )
                        ||
                        values.probability < 0
                        ||
                        values.probability > 100
                    )
                ) {

                    return NextResponse.json(
                        {
                            success: false,
                            error:
                                "Opportunity probability must be between 0 and 100.",
                        },
                        {
                            status: 400,
                        },
                    );

                }


                const opportunity =
                    await OpportunitiesServiceInstance.update(

                        opportunityId,

                        values,

                    );


                return NextResponse.json(
                    {
                        success: true,
                        data: opportunity,
                    },
                    {
                        status: 200,
                    },
                );

            } catch (error) {

                console.error(
                    "OPPORTUNITY_UPDATE_ERROR",
                    error,
                );


                return NextResponse.json(
                    {
                        success: false,
                        error:
                            "Failed to update opportunity.",
                    },
                    {
                        status: 500,
                    },
                );

            }

        },
    );

}


export async function DELETE(
    request: NextRequest,
    context: RouteContext,
) {

    return withTenantRequest(
        request,
        async () => {

            try {

                const {
                    id,
                } =
                    await context.params;


                const opportunityId =
                    getId(id);


                if (!opportunityId) {

                    return NextResponse.json(
                        {
                            success: false,
                            error:
                                "Opportunity id is required.",
                        },
                        {
                            status: 400,
                        },
                    );

                }


                const existing =
                    await OpportunitiesServiceInstance.details(
                        opportunityId,
                    );


                if (!existing) {

                    return NextResponse.json(
                        {
                            success: false,
                            error:
                                "Opportunity not found.",
                        },
                        {
                            status: 404,
                        },
                    );

                }


                await OpportunitiesServiceInstance.delete(
                    opportunityId,
                );


                return NextResponse.json(
                    {
                        success: true,
                        data: {
                            id:
                                opportunityId,
                        },
                    },
                    {
                        status: 200,
                    },
                );

            } catch (error) {

                console.error(
                    "OPPORTUNITY_DELETE_ERROR",
                    error,
                );


                return NextResponse.json(
                    {
                        success: false,
                        error:
                            "Failed to delete opportunity.",
                    },
                    {
                        status: 500,
                    },
                );

            }

        },
    );

}
