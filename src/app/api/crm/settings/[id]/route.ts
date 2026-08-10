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
    _request: Request,
    { params }: RouteContext,
) {

    try {

        const { id } =
            await params;

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
        );

    } catch (error) {

        console.error(
            'CRM Setting GET failed:',
            error,
        );

        return NextResponse.json(
            {
                message:
                    'Failed to load setting.',
            },
            {
                status: 500,
            },
        );

    }

}

export async function PUT(
    request: Request,
    { params }: RouteContext,
) {

    try {

        const { id } =
            await params;

        const body =
            await request.json();

        const setting =
            await SettingsServiceInstance.update(
                id,
                body,
            );

        return NextResponse.json(
            setting,
        );

    } catch (error) {

        console.error(
            'CRM Setting PUT failed:',
            error,
        );

        return NextResponse.json(
            {
                message:
                    'Failed to update setting.',
            },
            {
                status: 500,
            },
        );

    }

}

export async function DELETE(
    _request: Request,
    { params }: RouteContext,
) {

    try {

        const { id } =
            await params;

        await SettingsServiceInstance.delete(
            id,
        );

        return NextResponse.json(
            {
                success: true,
            },
        );

    } catch (error) {

        console.error(
            'CRM Setting DELETE failed:',
            error,
        );

        return NextResponse.json(
            {
                message:
                    'Failed to delete setting.',
            },
            {
                status: 500,
            },
        );

    }

}