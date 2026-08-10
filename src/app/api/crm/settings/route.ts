import { NextResponse } from 'next/server';

import {
    SettingsServiceInstance,
} from '@/services/crm/SettingsService';

export async function GET() {

    try {

        const settings =
            await SettingsServiceInstance.list();

        return NextResponse.json(
            settings,
        );

    } catch (error) {

        console.error(
            'CRM Settings GET failed:',
            error,
        );

        return NextResponse.json(
            {
                message:
                    'Failed to load settings.',
            },
            {
                status: 500,
            },
        );

    }

}

export async function POST(
    request: Request,
) {

    try {

        const body =
            await request.json();

        const setting =
            await SettingsServiceInstance.create(
                body,
            );

        return NextResponse.json(
            setting,
            {
                status: 201,
            },
        );

    } catch (error) {

        console.error(
            'CRM Settings POST failed:',
            error,
        );

        return NextResponse.json(
            {
                message:
                    'Failed to create setting.',
            },
            {
                status: 500,
            },
        );

    }

}
