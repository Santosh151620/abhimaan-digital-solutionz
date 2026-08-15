import {
    NextResponse,
} from 'next/server';

import {
    SettingsServiceInstance,
} from '@/services/crm/SettingsService';

import type {
    Setting,
} from '@/types/crm/Settings';



interface RouteContext {

    params: Promise<{
        id: string;
    }>;

}



function validateId(
    id: string,
): string {

    const normalized =
        id.trim();


    if (!normalized) {

        throw new Error(
            'Invalid setting id.',
        );

    }


    return normalized;

}



function isRecord(
    value: unknown,
): value is Record<string, unknown> {

    return (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
    );

}



function getErrorMessage(
    error: unknown,
): string {

    if (
        error instanceof Error
    ) {

        return error.message;

    }


    return String(error);

}



function getErrorStatus(
    error: unknown,
): number {

    const message =
        getErrorMessage(
            error,
        ).toLowerCase();


    if (
        message.includes(
            'permission denied',
        )
    ) {

        return 403;

    }


    if (
        message.includes(
            'not authenticated',
        ) ||
        message.includes(
            'unauthorized',
        ) ||
        message.includes(
            'authentication required',
        )
    ) {

        return 401;

    }


    if (
        message.includes(
            'not found',
        )
    ) {

        return 404;

    }


    if (
        message.includes(
            'already exists',
        ) ||
        message.includes(
            'duplicate',
        ) ||
        message.includes(
            'unique',
        ) ||
        message.includes(
            '23505',
        )
    ) {

        return 409;

    }


    if (
        message.includes(
            'required',
        ) ||
        message.includes(
            'invalid',
        ) ||
        message.includes(
            'cannot exceed',
        )
    ) {

        return 400;

    }


    return 500;

}



function errorResponse(
    error: unknown,
    fallbackMessage: string,
) {

    const status =
        getErrorStatus(
            error,
        );


    const message =
        status === 500
            ? fallbackMessage
            : getErrorMessage(
                error,
            );


    console.error(
        `CRM Setting API failed (${status}):`,
        error,
    );


    return NextResponse.json(
        {
            message,
        },
        {
            status,
        },
    );

}



export async function GET(
    _request: Request,
    { params }: RouteContext,
) {

    try {

        const {
            id: rawId,
        } =
            await params;


        const id =
            validateId(
                rawId,
            );


        const setting =
            await SettingsServiceInstance.details(
                id,
            );


        if (!setting) {

            return NextResponse.json(
                {
                    message:
                        'Setting not found.',
                },
                {
                    status: 404,
                },
            );

        }


        return NextResponse.json(
            setting,
            {
                status: 200,
            },
        );

    } catch (error) {

        return errorResponse(
            error,
            'Failed to load setting.',
        );

    }

}



export async function PUT(
    request: Request,
    { params }: RouteContext,
) {

    try {

        const {
            id: rawId,
        } =
            await params;


        const id =
            validateId(
                rawId,
            );


        let body: unknown;


        try {

            body =
                await request.json();

        } catch {

            return NextResponse.json(
                {
                    message:
                        'Request body must contain valid JSON.',
                },
                {
                    status: 400,
                },
            );

        }


        if (
            !isRecord(body)
        ) {

            return NextResponse.json(
                {
                    message:
                        'Request body must be an object.',
                },
                {
                    status: 400,
                },
            );

        }


        const setting =
            await SettingsServiceInstance.update(
                id,
                body as Partial<Setting>,
            );


        return NextResponse.json(
            setting,
            {
                status: 200,
            },
        );

    } catch (error) {

        return errorResponse(
            error,
            'Failed to update setting.',
        );

    }

}



export async function DELETE(
    _request: Request,
    { params }: RouteContext,
) {

    try {

        const {
            id: rawId,
        } =
            await params;


        const id =
            validateId(
                rawId,
            );


        const existing =
            await SettingsServiceInstance.details(
                id,
            );


        if (!existing) {

            return NextResponse.json(
                {
                    message:
                        'Setting not found.',
                },
                {
                    status: 404,
                },
            );

        }


        await SettingsServiceInstance.delete(
            id,
        );


        return NextResponse.json(
            {
                success: true,
            },
            {
                status: 200,
            },
        );

    } catch (error) {

        return errorResponse(
            error,
            'Failed to delete setting.',
        );

    }

}