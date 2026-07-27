import { NextResponse } from 'next/server';

import {
    SettingsServiceInstance,
} from '@/services/crm/SettingsService';

export async function GET() {

    const settings =
        SettingsServiceInstance.list();

    return NextResponse.json(
        settings,
    );

}

export async function POST(
    request: Request,
) {

    const body =
        await request.json();

    const setting =
        SettingsServiceInstance.create(
            body,
        );

    return NextResponse.json(
        setting,
        {
            status: 201,
        },
    );

}