import { NextResponse } from 'next/server';

import {
    ContractsServiceInstance,
} from '@/services/crm/ContractsService';

export async function GET() {

    const contracts =
        ContractsServiceInstance.list();

    return NextResponse.json(
        contracts
    );

}

export async function POST(
    request: Request
) {

    const body =
        await request.json();

    const contract =
        ContractsServiceInstance.create(
            body
        );

    return NextResponse.json(
        contract,
        {
            status: 201,
        }
    );

}