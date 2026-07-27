import { NextResponse } from 'next/server';

import {
    KnowledgeBaseServiceInstance,
} from '@/services/crm/KnowledgeBaseService';

import type {
    KnowledgeStatus,
} from '@/types/crm/KnowledgeBase';

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

        const article =
            KnowledgeBaseServiceInstance.details(
                id,
            );

        if (!article) {

            return NextResponse.json(
                {
                    message:
                        'Knowledge article not found.',
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(
            article,
            {
                status: 200,
            },
        );

    } catch {

        return NextResponse.json(
            {
                message:
                    'Failed to fetch knowledge article.',
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

        const article =
            KnowledgeBaseServiceInstance.update(
                id,
                body,
            );

        if (!article) {

            return NextResponse.json(
                {
                    message:
                        'Knowledge article not found.',
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(
            article,
            {
                status: 200,
            },
        );

    } catch {

        return NextResponse.json(
            {
                message:
                    'Failed to update knowledge article.',
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
            status?: KnowledgeStatus;
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

        const article =
            KnowledgeBaseServiceInstance.updateStatus(
                id,
                body.status,
            );

        if (!article) {

            return NextResponse.json(
                {
                    message:
                        'Knowledge article not found.',
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(
            article,
            {
                status: 200,
            },
        );

    } catch {

        return NextResponse.json(
            {
                message:
                    'Failed to update knowledge article status.',
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
            KnowledgeBaseServiceInstance.delete(
                id,
            );

        if (!deleted) {

            return NextResponse.json(
                {
                    message:
                        'Knowledge article not found.',
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
                    'Failed to delete knowledge article.',
            },
            {
                status: 500,
            },
        );

    }

}