import { NextResponse } from 'next/server';

import {
    SettingsServiceInstance,
} from '@/services/crm/SettingsService';

interface RouteContext {

    params: Promise<{
        id: string;
    }>;

}

export async function GET(
    request: Request,
    { params }: RouteContext,
) {

    const { id } =
        await params;

    const setting =
        SettingsServiceInstance.details(
            id,
        );

    if (!setting) {

        return NextResponse.json(
            {
                message:
                    'Setting not found',
            },
            {
                status: 404,
            },
        );

    }

    return NextResponse.json(
        setting,
    );

}

export async function PUT(
    request: Request,
    { params }: RouteContext,
) {

    const { id } =
        await params;

    const body =
        await request.json();

    const updated =
        SettingsServiceInstance.update(
            id,
            body,
        );

    if (!updated) {

        return NextResponse.json(
            {
                message:
                    'Setting not found',
            },
            {
                status: 404,
            },
        );

    }

    return NextResponse.json(
        updated,
    );

}

export async function DELETE(
    request: Request,
    { params }: RouteContext,
) {

    const { id } =
        await params;

    const deleted =
        SettingsServiceInstance.delete(
            id,
        );

    if (!deleted) {

        return NextResponse.json(
            {
                message:
                    'Setting not found',
            },
            {
                status: 404,
            },
        );

    }

    return NextResponse.json(
        {
            success: true,
        },
    );

}