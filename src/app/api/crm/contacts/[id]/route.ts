import { NextResponse } from "next/server";

import {
    ContactsServiceInstance,
} from "@/services/crm/ContactsService";


interface Props {

    params: Promise<{
        id: string;
    }>;

}



export async function GET(
    _request: Request,
    { params }: Props,
) {

    try {

        const { id } =
            await params;


        const contact =
            await ContactsServiceInstance.findById(
                id,
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


        return NextResponse.json(
            contact,
        );


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
    { params }: Props,
) {

    try {

        const { id } =
            await params;


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


        return NextResponse.json(
            contact,
        );


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
    _request: Request,
    { params }: Props,
) {

    try {

        const { id } =
            await params;


        const deleted =
            await ContactsServiceInstance.delete(
                id
            );

        return NextResponse.json(
            {
                success: true,
            },
        );


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