import {
    NextRequest,
    NextResponse,
} from "next/server";


import {
    OpportunitiesServiceInstance,
} from "@/services/crm/OpportunitiesService";


import type {
    OpportunitySearchFilters,
    OpportunityStage,
    OpportunityStatus,
} from "@/types/crm/Opportunities";


import {
    withTenantRequest,
} from "@/lib/tenant/withTenantRequest";


const VALID_STAGES:
    OpportunityStage[] = [
        "New",
        "Qualified",
        "Proposal",
        "Negotiation",
        "Won",
        "Lost",
    ];


const VALID_STATUSES:
    OpportunityStatus[] = [
        "Open",
        "Won",
        "Lost",
        "On Hold",
    ];


function getOptionalQueryValue(
    value: string | null,
): string | undefined {

    const normalized =
        value?.trim();

    return normalized || undefined;

}


function isOpportunityStage(
    value: string,
): value is OpportunityStage {

    return VALID_STAGES.includes(
        value as OpportunityStage,
    );

}


function isOpportunityStatus(
    value: string,
): value is OpportunityStatus {

    return VALID_STATUSES.includes(
        value as OpportunityStatus,
    );

}


export async function GET(
    request: NextRequest,
) {

    return withTenantRequest(
        request,
        async () => {

            try {

                const searchParams =
                    request.nextUrl.searchParams;


                const status =
                    getOptionalQueryValue(
                        searchParams.get("status"),
                    );


                const stage =
                    getOptionalQueryValue(
                        searchParams.get("stage"),
                    );


                const companyId =
                    getOptionalQueryValue(
                        searchParams.get("companyId"),
                    );


                const contactId =
                    getOptionalQueryValue(
                        searchParams.get("contactId"),
                    );


                const leadId =
                    getOptionalQueryValue(
                        searchParams.get("leadId"),
                    );


                const ownerId =
                    getOptionalQueryValue(
                        searchParams.get("ownerId"),
                    );


                const assignedTo =
                    getOptionalQueryValue(
                        searchParams.get("assignedTo"),
                    );


                const search =
                    getOptionalQueryValue(
                        searchParams.get("search"),
                    );


                const keyword =
                    getOptionalQueryValue(
                        searchParams.get("keyword"),
                    );


                if (
                    status
                    &&
                    !isOpportunityStatus(
                        status,
                    )
                ) {

                    return NextResponse.json(
                        {
                            success: false,
                            error:
                                "Invalid opportunity status.",
                        },
                        {
                            status: 400,
                        },
                    );

                }


                if (
                    stage
                    &&
                    !isOpportunityStage(
                        stage,
                    )
                ) {

                    return NextResponse.json(
                        {
                            success: false,
                            error:
                                "Invalid opportunity stage.",
                        },
                        {
                            status: 400,
                        },
                    );

                }


                const filters:
                    OpportunitySearchFilters = {

                    status:
                        status &&
                            isOpportunityStatus(status)
                            ? status
                            : undefined,

                    stage:
                        stage &&
                            isOpportunityStage(stage)
                            ? stage
                            : undefined,

                    companyId,

                    contactId,

                    leadId,

                    ownerId,

                    assignedTo,

                    search,

                    keyword,

                };

                const hasFilters =
                    Object.values(filters)
                        .some(
                            value =>
                                value !== undefined
                                &&
                                value !== "",
                        );


                const opportunities =
                    hasFilters
                        ? await OpportunitiesServiceInstance.search(
                            filters,
                        )
                        : await OpportunitiesServiceInstance.list();


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
                            "Failed to load opportunities.",
                    },
                    {
                        status: 500,
                    },
                );

            }

        },
    );

}


export async function POST(
    request: NextRequest,
) {

    return withTenantRequest(
        request,
        async () => {

            try {

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


                const name =
                    typeof body.name === "string"
                        ? body.name.trim()
                        : "";


                const title =
                    typeof body.title === "string"
                        ? body.title.trim()
                        : "";


                if (
                    !name
                    &&
                    !title
                ) {

                    return NextResponse.json(
                        {
                            success: false,
                            error:
                                "Opportunity name is required.",
                        },
                        {
                            status: 400,
                        },
                    );

                }


                if (
                    body.value !== undefined
                    &&
                    (
                        typeof body.value !== "number"
                        ||
                        !Number.isFinite(
                            body.value,
                        )
                        ||
                        body.value < 0
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
                    body.probability !== undefined
                    &&
                    (
                        typeof body.probability !== "number"
                        ||
                        !Number.isFinite(
                            body.probability,
                        )
                        ||
                        body.probability < 0
                        ||
                        body.probability > 100
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


                if (
                    body.stage !== undefined
                    &&
                    (
                        typeof body.stage !== "string"
                        ||
                        !isOpportunityStage(
                            body.stage.trim(),
                        )
                    )
                ) {

                    return NextResponse.json(
                        {
                            success: false,
                            error:
                                "Invalid opportunity stage.",
                        },
                        {
                            status: 400,
                        },
                    );

                }


                if (
                    body.status !== undefined
                    &&
                    (
                        typeof body.status !== "string"
                        ||
                        !isOpportunityStatus(
                            body.status.trim(),
                        )
                    )
                ) {

                    return NextResponse.json(
                        {
                            success: false,
                            error:
                                "Invalid opportunity status.",
                        },
                        {
                            status: 400,
                        },
                    );

                }


                const opportunity =
                    await OpportunitiesServiceInstance.create(
                        {
                            ...body,
                            ...(name
                                ? {
                                    name,
                                }
                                : {}),
                            ...(title
                                ? {
                                    title,
                                }
                                : {}),
                        },
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
                            "Failed to create opportunity.",
                    },
                    {
                        status: 500,
                    },
                );

            }

        },
    );

}
