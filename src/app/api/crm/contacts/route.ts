import { NextResponse } from "next/server";

import { ContactsServiceInstance } from "@/services/crm/ContactsService";

export async function GET() {

    try {

        const contacts =
            await ContactsServiceInstance.list();

        return NextResponse.json(
            contacts,
        );

    } catch {

        return NextResponse.json(
            {
                error: "Failed to load contacts",
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

        const contact =
            await ContactsServiceInstance.create(
                body,
            );

        return NextResponse.json(
            contact,
            {
                status: 201,
            },
        );

    } catch {

        return NextResponse.json(
            {
                error: "Failed to create contact",
            },
            {
                status: 500,
            },
        );

    }

}