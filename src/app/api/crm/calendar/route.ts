import { NextResponse } from 'next/server';

import {
    CalendarServiceInstance,
} from '@/services/crm/CalendarService';

export async function GET() {

    try {

        const events =
            CalendarServiceInstance.list();

        return NextResponse.json(
            events,
            {
                status: 200,
            },
        );

    } catch {

        return NextResponse.json(
            {
                message:
                    'Failed to fetch calendar events.',
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

        const event =
            CalendarServiceInstance.create(
                body,
            );

        return NextResponse.json(
            event,
            {
                status: 201,
            },
        );

    } catch {

        return NextResponse.json(
            {
                message:
                    'Failed to create calendar event.',
            },
            {
                status: 500,
            },
        );

    }

}