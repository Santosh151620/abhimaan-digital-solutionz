import {
    NextRequest,
} from "next/server";


import {
    requireAdmin,
} from "@/lib/requireAdmin";


import {
    ExportService,
} from "@/services/crm/ExportService";


import type {
    ExportRequest,
    ImportExportEntityType,
} from "@/types/crm/ImportExport";



interface ExportPayload
    extends ExportRequest {

    entityType:
        ImportExportEntityType;

}



const allowedEntities =
    new Set<string>([

        "Lead",

        "Contact",

        "Company",

        "Opportunity",

        "Quotation",

        "Invoice",

        "Project",

        "Task",

        "Ticket",

        "Activity",

        "Payment",

        "Product",

        "Contract",

    ]);



export async function POST(
    request: NextRequest,
) {

    try {

        const {
            supabase,
        } =
            await requireAdmin();
const payload = await request.json() as ExportPayload;

        if (
            !allowedEntities.has(
                payload.entityType,
            )
        ) {

            return Response.json(

                {

                    success:false,

                    message:
                        "Unsupported export entity.",

                },

                {

                    status:400,

                },

            );

        }



        const table =
            payload.entityType
                .toLowerCase()
                + "s";



        const {
            data,

            error,

        } =
            await supabase

                .from(table)

                .select("*");



        if(error){

            throw error;

        }



        const service =
            new ExportService();



        const csv =
            await service.execute(

                payload,

                (
                    data ?? []
                ) as Record<
                    string,
                    unknown
                >[],

            );



        return new Response(

            csv,

            {

                headers: {

                    "Content-Type":
                        "text/csv",

                    "Content-Disposition":

                        `attachment; filename="${table}-export.csv"`,

                },

            },

        );


    }

    catch(error: unknown) {


        return Response.json(

            {

                success:false,

                message:

                    error instanceof Error

                        ? error.message

                        : "Export failed.",

            },

            {

                status:500,

            },

        );

    }

}