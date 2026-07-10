import { NextResponse } from 'next/server';
import { CompaniesServiceInstance } from '@/services/crm/CompaniesService';

export async function GET() {
    try {
        const companies = await CompaniesServiceInstance.list();

        return NextResponse.json(companies);
    } catch {
        return NextResponse.json(
            {
                error: 'Failed to load companies',
            },
            {
                status: 500,
            }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const company =
            await CompaniesServiceInstance.create(body);

        return NextResponse.json(company, {
            status: 201,
        });
    } catch {
        return NextResponse.json(
            {
                error: 'Failed to create company',
            },
            {
                status: 500,
            }
        );
    }
}