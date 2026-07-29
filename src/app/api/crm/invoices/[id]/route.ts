import { NextResponse } from 'next/server';

import {
    InvoicesServiceInstance,
} from '@/services/crm/InvoicesService';

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

        const invoice =
            InvoicesServiceInstance.details(
                id,
            );

        if (!invoice) {

            return NextResponse.json(
                {
                    error:
                        'Invoice not found',
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(
            {
                data: invoice,
            },
        );

    } catch (error) {

        console.error(
            'Invoices GET by ID error:',
            error,
        );

        return NextResponse.json(
            {
                error:
                    'Failed to load invoice',
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

        const invoice =
            InvoicesServiceInstance.update(
                id,
                body,
            );

        if (!invoice) {

            return NextResponse.json(
                {
                    error:
                        'Invoice not found',
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(
            {
                data: invoice,
            },
        );

    } catch (error) {

        console.error(
            'Invoices PUT error:',
            error,
        );

        return NextResponse.json(
            {
                error:
                    'Failed to update invoice',
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
            InvoicesServiceInstance.delete(
                id,
            );

        if (!deleted) {

            return NextResponse.json(
                {
                    error:
                        'Invoice not found',
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

    } catch (error) {

        console.error(
            'Invoices DELETE error:',
            error,
        );

        return NextResponse.json(
            {
                error:
                    'Failed to delete invoice',
            },
            {
                status: 500,
            },
        );

    }

}