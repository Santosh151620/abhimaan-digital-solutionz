import { NextResponse } from "next/server";

import {
    KnowledgeBaseServiceInstance,
} from "@/services/crm/KnowledgeBaseService";

export async function GET() {

    try {

        const articles =
            await KnowledgeBaseServiceInstance.list();

        return NextResponse.json(
            {
                data: articles,
            },
            {
                status: 200,
            },
        );

    } catch (error) {

        console.error(
            "Knowledge Base GET error:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Failed to fetch knowledge articles.",
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
            await KnowledgeBaseServiceInstance.create(
                body,
            );

        return NextResponse.json(
            {
                data: article,
            },
            {
                status: 201,
            },
        );

    } catch (error) {

        console.error(
            "Knowledge Base POST error:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Failed to create knowledge article.",
            },
            {
                status: 500,
            },
        );

    }

}