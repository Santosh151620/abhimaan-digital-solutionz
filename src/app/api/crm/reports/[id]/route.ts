import { NextResponse } from 'next/server';

import {
    ReportServiceInstance,
} from '@/services/crm/ReportsService';

import type {
    ReportStatus,
} from '@/types/crm/Reports';

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

        const report =
            ReportServiceInstance.details(
                id,
            );

        if (!report) {

            return NextResponse.json(
                {
                    message:
                        'Report not found.',
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(
            report,
            {
                status: 200,
            },
        );

    } catch {

        return NextResponse.json(
            {
                message:
                    'Failed to fetch report.',
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

        const report =
            ReportServiceInstance.update(
                id,
                body,
            );

        if (!report) {

            return NextResponse.json(
                {
                    message:
                        'Report not found.',
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(
            report,
            {
                status: 200,
            },
        );

    } catch {

        return NextResponse.json(
            {
                message:
                    'Failed to update report.',
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
            status?: ReportStatus;
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

        const report =
            ReportServiceInstance.updateStatus(
                id,
                body.status,
            );

        if (!report) {

            return NextResponse.json(
                {
                    message:
                        'Report not found.',
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(
            report,
            {
                status: 200,
            },
        );

    } catch {

        return NextResponse.json(
            {
                message:
                    'Failed to update report status.',
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
            ReportServiceInstance.delete(
                id,
            );

        if (!deleted) {

            return NextResponse.json(
                {
                    message:
                        'Report not found.',
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
                    'Failed to delete report.',
            },
            {
                status: 500,
            },
        );

    }

}