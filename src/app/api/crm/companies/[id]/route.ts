import { NextResponse } from 'next/server';
import { CompaniesServiceInstance } from '@/services/crm/CompaniesService';

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    request: Request,
    { params }: RouteContext
) {
    try {
        const { id } = await params;

        const company =
            await CompaniesServiceInstance.details(id);

        if (!company) {
            return NextResponse.json(
                {
                    error: 'Company not found',
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(company);
    } catch {
        return NextResponse.json(
            {
                error: 'Failed to load company',
            },
            {
                status: 500,
            }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: RouteContext
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const company =
            await CompaniesServiceInstance.update(id, body);

        return NextResponse.json(company);
    } catch {
        return NextResponse.json(
            {
                error: 'Failed to update company',
            },
            {
                status: 500,
            }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: RouteContext
) {
    try {
        const { id } = await params;

        await CompaniesServiceInstance.delete(id);

        return NextResponse.json({
            success: true,
        });
    } catch {
        return NextResponse.json(
            {
                error: 'Failed to delete company',
            },
            {
                status: 500,
            }
        );
    }
}