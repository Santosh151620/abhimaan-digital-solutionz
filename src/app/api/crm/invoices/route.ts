import { NextResponse } from 'next/server';

import {
    InvoicesServiceInstance,
} from '@/services/crm/InvoicesService';

export async function GET() {

    try {

        const invoices =
            InvoicesServiceInstance.list();

        return NextResponse.json(
            {
                data: invoices,
            },
        );

    } catch (error) {

        console.error(
            'Invoices GET error:',
            error,
        );

        return NextResponse.json(
            {
                error:
                    'Failed to load invoices',
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

        const invoice =
            InvoicesServiceInstance.create(
                body,
            );

        return NextResponse.json(
            {
                data: invoice,
            },
            {
                status: 201,
            },
        );

    } catch (error) {

        console.error(
            'Invoices POST error:',
            error,
        );

        return NextResponse.json(
            {
                error:
                    'Failed to create invoice',
            },
            {
                status: 500,
            },
        );

    }

}