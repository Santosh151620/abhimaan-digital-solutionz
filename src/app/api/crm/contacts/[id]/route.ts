import { NextResponse } from 'next/server';

import {
    ContactsServiceInstance,
} from '@/services/crm/ContactsService';

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

        const contact =
            await ContactsServiceInstance.details(
                id,
            );

        if (!contact) {

            return NextResponse.json(
                {
                    message: 'Contact not found.',
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(
            contact,
        );

    } catch {

        return NextResponse.json(
            {
                message:
                    'Failed to load contact.',
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

        const contact =
            await ContactsServiceInstance.update(
                id,
                body,
            );

        return NextResponse.json(
            contact,
        );

    } catch {

        return NextResponse.json(
            {
                message:
                    'Failed to update contact.',
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

        await ContactsServiceInstance.delete(
            id,
        );

        return NextResponse.json(
            {
                success: true,
            },
        );

    } catch {

        return NextResponse.json(
            {
                message:
                    'Failed to delete contact.',
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

        const body =
            await request.json();

        if (body.restore === true) {

            await ContactsServiceInstance.restore(
                id,
            );

            return NextResponse.json(
                {
                    success: true,
                },
            );

        }

        return NextResponse.json(
            {
                message:
                    'Unsupported patch operation.',
            },
            {
                status: 400,
            },
        );

    } catch {

        return NextResponse.json(
            {
                message:
                    'Failed to process request.',
            },
            {
                status: 500,
            },
        );

    }

}