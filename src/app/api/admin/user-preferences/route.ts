import {
    NextResponse,
} from "next/server";

import {
    UserPreferenceServiceInstance,
} from "@/services/admin/UserPreferenceService";

import {
    createClient,
} from "@/lib/supabase/server";


async function resolveContext() {

    const supabase =
        await createClient();

    const {
        data: {
            user,
        },
        error: authError,
    } =
        await supabase.auth.getUser();

    if (
        authError ||
        !user
    ) {
        return null;
    }

    const {
        data: membership,
        error: membershipError,
    } =
        await supabase
            .from("organization_members")
            .select("organization_id")
            .eq("profile_id", user.id)
            .eq("is_active", true)
            .limit(1)
            .maybeSingle();

    if (
        membershipError ||
        !membership?.organization_id
    ) {
        return null;
    }

    return {
        userId: user.id,
        organizationId: membership.organization_id,
    };
}


export async function GET() {

    try {

        const context =
            await resolveContext();

        if (!context) {

            return NextResponse.json(
                {
                    error: "Unauthorized.",
                },
                {
                    status: 401,
                },
            );

        }

        const preferences =
            await UserPreferenceServiceInstance.get(
                context.userId,
                context.organizationId,
            );

        return NextResponse.json(
            {
                data: preferences,
            },
            {
                status: 200,
            },
        );

    }
    catch (error) {

        console.error(
            "[GET /api/admin/user-preferences]",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Failed to load user preferences.",
            },
            {
                status: 500,
            },
        );

    }

}


export async function PATCH(
    request: Request,
) {

    try {

        const context =
            await resolveContext();

        if (!context) {

            return NextResponse.json(
                {
                    error: "Unauthorized.",
                },
                {
                    status: 401,
                },
            );

        }

        const body =
            await request.json();

        if (
            !body ||
            typeof body !== "object" ||
            Array.isArray(body)
        ) {

            return NextResponse.json(
                {
                    error:
                        "Invalid preference payload.",
                },
                {
                    status: 400,
                },
            );

        }

        const preferences =
            await UserPreferenceServiceInstance.update(
                context.userId,
                context.organizationId,
                body,
            );

        return NextResponse.json(
            {
                data: preferences,
            },
            {
                status: 200,
            },
        );

    }
    catch (error) {

        console.error(
            "[PATCH /api/admin/user-preferences]",
            error,
        );

        const message =
            error instanceof Error
                ? error.message
                : "Failed to update user preferences.";

        return NextResponse.json(
            {
                error: message,
            },
            {
                status: 400,
            },
        );

    }

}
