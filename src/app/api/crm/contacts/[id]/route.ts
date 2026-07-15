import { NextResponse } from "next/server";

import { ContactsServiceInstance } from "@/services/crm/ContactsService";

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

        const { id } = await params;

        const contact =
            await ContactsServiceInstance.details(id);

        if (!contact) {

            return NextResponse.json(
                {
                    error: "Contact not found",
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(contact);

    } catch {

        return NextResponse.json(
            {
                error: "Failed to load contact",
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

        const { id } = await params;

        const body =
            await request.json();

        const contact =
            await ContactsServiceInstance.update(
                id,
                body,
            );

        if (!contact) {

            return NextResponse.json(
                {
                    error: "Contact not found",
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(contact);

    } catch {

        return NextResponse.json(
            {
                error: "Failed to update contact",
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

        const { id } = await params;

        const success =
            await ContactsServiceInstance.delete(id);

        if (!success) {

            return NextResponse.json(
                {
                    error: "Contact not found",
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json({
            success: true,
        });

    } catch {

        return NextResponse.json(
            {
                error: "Failed to delete contact",
            },
            {
                status: 500,
            },
        );

    }

}