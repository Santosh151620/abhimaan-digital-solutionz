import {
    NextResponse,
} from 'next/server';

import {
    SettingsServiceInstance,
} from '@/services/crm/SettingsService';

import type {
    Setting,
} from '@/types/crm/Settings';



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
        `CRM Settings API failed (${status}):`,
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



export async function GET() {

    try {

        const settings =
            await SettingsServiceInstance.list();


        return NextResponse.json(
            settings,
            {
                status: 200,
            },
        );

    } catch (error) {

        return errorResponse(
            error,
            'Failed to load settings.',
        );

    }

}



export async function POST(
    request: Request,
) {

    try {

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
            await SettingsServiceInstance.create(
                body as Partial<Setting>,
            );


        return NextResponse.json(
            setting,
            {
                status: 201,
            },
        );

    } catch (error) {

        return errorResponse(
            error,
            'Failed to create setting.',
        );

    }

}