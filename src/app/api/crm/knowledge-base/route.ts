import { NextResponse } from 'next/server';

import {
    KnowledgeBaseServiceInstance,
} from '@/services/crm/KnowledgeBaseService';

export async function GET() {

    try {

        const articles =
            KnowledgeBaseServiceInstance.list();

        return NextResponse.json(
            articles,
            {
                status: 200,
            },
        );

    } catch {

        return NextResponse.json(
            {
                message:
                    'Failed to fetch knowledge articles.',
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

        const article =
            KnowledgeBaseServiceInstance.create(
                body,
            );

        return NextResponse.json(
            article,
            {
                status: 201,
            },
        );

    } catch {

        return NextResponse.json(
            {
                message:
                    'Failed to create knowledge article.',
            },
            {
                status: 500,
            },
        );

    }

}