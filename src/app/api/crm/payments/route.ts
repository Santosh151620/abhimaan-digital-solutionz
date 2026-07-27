import {
    NextRequest,
    NextResponse,
} from 'next/server';

import {
    PaymentsServiceInstance,
} from '@/services/crm/PaymentsService';

import type {
    PaymentSearchFilters,
    PaymentMethod,
    PaymentStatus,
} from '@/types/crm/Payments';

function isPaymentStatus(
    value: string | undefined,
): value is PaymentStatus {

    return value !== undefined && [
        'Pending',
        'Paid',
        'Partially Paid',
        'Overdue',
        'Cancelled',
        'Refunded',
    ].includes(value);

}

function isPaymentMethod(
    value: string | undefined,
): value is PaymentMethod {

    return value !== undefined && [
        'Cash',
        'Bank Transfer',
        'Cheque',
        'Credit Card',
        'Debit Card',
        'UPI',
        'Wallet',
        'Other',
    ].includes(value);

}

export async function GET(
    request: NextRequest,
) {

    try {

        const searchParams =
            request.nextUrl.searchParams;

        const filters: PaymentSearchFilters = {

            search:
                searchParams.get('search') ??
                undefined,

            companyId:
                searchParams.get('companyId') ??
                undefined,

            invoiceId:
                searchParams.get('invoiceId') ??
                undefined,

        };

        const status =
            searchParams.get('status') ??
            undefined;

        if (
            isPaymentStatus(
                status,
            )
        ) {

            filters.status =
                status;

        }

        const paymentMethod =
            searchParams.get('paymentMethod') ??
            undefined;

        if (
            isPaymentMethod(
                paymentMethod,
            )
        ) {

            filters.paymentMethod =
                paymentMethod;

        }

        const payments =
            Object.keys(filters).length > 0
                ? await PaymentsServiceInstance.search(
                      filters,
                  )
                : await PaymentsServiceInstance.list();

        return NextResponse.json(
            {
                success: true,
                data: payments,
            },
            {
                status: 200,
            },
        );

    } catch (error) {

        console.error(
            'PAYMENTS_GET_ERROR',
            error,
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    'Unable to load payments.',
            },
            {
                status: 500,
            },
        );

    }

}

export async function POST(
    request: NextRequest,
) {

    try {

        const body =
            await request.json();

        const payment =
            await PaymentsServiceInstance.create(
                body,
            );

        return NextResponse.json(
            {
                success: true,
                data: payment,
            },
            {
                status: 201,
            },
        );

    } catch (error) {

        console.error(
            'PAYMENTS_POST_ERROR',
            error,
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    'Unable to create payment.',
            },
            {
                status: 500,
            },
        );

    }

}