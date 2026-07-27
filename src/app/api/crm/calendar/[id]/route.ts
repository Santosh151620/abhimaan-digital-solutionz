import { NextResponse } from 'next/server';

import {
    CalendarServiceInstance,
} from '@/services/crm/CalendarService';

import type {
    CalendarStatus,
} from '@/types/crm/Calendar';

interface RouteContext {

    params: Promise<{
        id: string;
    }>;

}

export async function GET(
    request: Request,
    { params }: RouteContext,
) {

    try {

        const { id } =
            await params;

        const event =
            CalendarServiceInstance.details(
                id,
            );

        if (!event) {

            return NextResponse.json(
                {
                    message:
                        'Calendar event not found.',
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(
            event,
            {
                status: 200,
            },
        );

    } catch {

        return NextResponse.json(
            {
                message:
                    'Failed to fetch calendar event.',
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

        const event =
            CalendarServiceInstance.update(
                id,
                body,
            );

        if (!event) {

            return NextResponse.json(
                {
                    message:
                        'Calendar event not found.',
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(
            event,
            {
                status: 200,
            },
        );

    } catch {

        return NextResponse.json(
            {
                message:
                    'Failed to update calendar event.',
            },
            {
                status: 500,
            },
        );

    }

}

export async function PATCH(
    request: Request,
    { params }: RouteContext,
) {

    try {

        const { id } =
            await params;

        const body: {
            status?: CalendarStatus;
        } =
            await request.json();

        if (!body.status) {

            return NextResponse.json(
                {
                    message:
                        'Status is required.',
                },
                {
                    status: 400,
                },
            );

        }

        const event =
            CalendarServiceInstance.updateStatus(
                id,
                body.status,
            );

        if (!event) {

            return NextResponse.json(
                {
                    message:
                        'Calendar event not found.',
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(
            event,
            {
                status: 200,
            },
        );

    } catch {

        return NextResponse.json(
            {
                message:
                    'Failed to update calendar event status.',
            },
            {
                status: 500,
            },
        );

    }

}

export async function DELETE(
    request: Request,
    { params }: RouteContext,
) {

    try {

        const { id } =
            await params;

        const deleted =
            CalendarServiceInstance.delete(
                id,
            );

        if (!deleted) {

            return NextResponse.json(
                {
                    message:
                        'Calendar event not found.',
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
            {
                status: 200,
            },
        );

    } catch {

        return NextResponse.json(
            {
                message:
                    'Failed to delete calendar event.',
                },
                {
                    status: 500,
                },
            );

    }

}