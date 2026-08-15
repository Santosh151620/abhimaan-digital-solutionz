import {
    NextResponse,
} from "next/server";

import {
    UserPreferenceServiceInstance,
} from "@/services/admin/UserPreferenceService";

import {
    createClient,
} from "@/lib/supabase/server";


/**
 * ============================================================================
 * ADS ADMIN — USER PREFERENCES API
 * ============================================================================
 *
 * Runtime API for the authenticated user's application preferences.
 *
 * Persistence is intentionally hidden behind UserPreferenceService.
 *
 * Current architecture:
 *
 *     Authenticated User
 *           ↓
 *     organization_members
 *           ↓
 *     UserPreferenceService
 *           ↓
 *     organization_settings
 *
 * IMPORTANT:
 *
 * - This route never accepts userId from the client.
 * - This route never accepts organizationId from the client.
 * - Authentication comes from the Supabase server session.
 * - Organization ownership comes from the authenticated user's active
 *   organization membership.
 * - Preference validation/business rules remain in UserPreferenceService.
 * - Database persistence remains behind the service/repository boundary.
 * ============================================================================
 */


/* ============================================================================
 * REQUEST CONTEXT
 * ========================================================================== */

interface UserPreferenceContext {

    userId:
        string;

    organizationId:
        string;

}


/**
 * Resolve the authenticated user's organization context.
 *
 * The client cannot choose either identifier.
 */
async function resolveContext():
    Promise<UserPreferenceContext | null> {


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

            .select(
                "organization_id",
            )

            .eq(
                "profile_id",
                user.id,
            )

            .eq(
                "is_active",
                true,
            )

            .order(
                "organization_id",
                {
                    ascending: true,
                },
            )

            .limit(1)

            .maybeSingle();


    if (
        membershipError ||
        !membership?.organization_id
    ) {

        return null;

    }


    return {

        userId:
            user.id,

        organizationId:
            membership.organization_id,

    };

}


/* ============================================================================
 * ERROR HELPERS
 * ========================================================================== */

function isClientValidationError(
    error: unknown,
): boolean {

    if (
        !(error instanceof Error)
    ) {

        return false;

    }


    const message =
        error.message.toLowerCase();


    return (

        message.includes(
            "required",
        )

        ||

        message.includes(
            "unsupported",
        )

        ||

        message.includes(
            "must be",
        )

        ||

        message.includes(
            "invalid",
        )

    );

}


/* ============================================================================
 * GET
 * ========================================================================== */

export async function GET() {

    try {

        const context =
            await resolveContext();


        if (!context) {

            return NextResponse.json(

                {
                    error:
                        "Unauthorized.",
                },

                {
                    status:
                        401,
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
                data:
                    preferences,
            },

            {
                status:
                    200,
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
                status:
                    500,
            },

        );

    }

}


/* ============================================================================
 * PATCH
 * ========================================================================== */

export async function PATCH(
    request: Request,
) {

    try {

        const context =
            await resolveContext();


        if (!context) {

            return NextResponse.json(

                {
                    error:
                        "Unauthorized.",
                },

                {
                    status:
                        401,
                },

            );

        }


        let body:
            unknown;


        try {

            body =
                await request.json();

        }
        catch {

            return NextResponse.json(

                {
                    error:
                        "Invalid JSON request body.",
                },

                {
                    status:
                        400,
                },

            );

        }


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
                    status:
                        400,
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
                data:
                    preferences,
            },

            {
                status:
                    200,
            },

        );

    }
    catch (error) {

        console.error(
            "[PATCH /api/admin/user-preferences]",
            error,
        );


        if (
            isClientValidationError(
                error,
            )
        ) {

            return NextResponse.json(

                {
                    error:
                        error instanceof Error
                            ? error.message
                            : "Invalid preference payload.",
                },

                {
                    status:
                        400,
                },

            );

        }


        return NextResponse.json(

            {
                error:
                    "Failed to update user preferences.",
            },

            {
                status:
                    500,
            },

        );

    }

}