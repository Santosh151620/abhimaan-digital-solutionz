import { NextResponse } from 'next/server';

import {
    ReportServiceInstance,
} from '@/services/crm/ReportsService';

export async function GET() {

    try {

        const reports =
            ReportServiceInstance.list();

        return NextResponse.json(
            reports,
            {
                status: 200,
            },
        );

    } catch {

        return NextResponse.json(
            {
                message:
                    'Failed to fetch reports.',
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

        const report =
            ReportServiceInstance.create(
                body,
            );

        return NextResponse.json(
            report,
            {
                status: 201,
            },
        );

    } catch {

        return NextResponse.json(
            {
                message:
                    'Failed to create report.',
            },
            {
                status: 500,
            },
        );

    }

}