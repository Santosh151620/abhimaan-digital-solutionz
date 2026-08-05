import {
    NextRequest,
} from "next/server";


import {
    requireAdmin,
} from "@/lib/requireAdmin";


import {
    ImportService,
} from "@/services/crm/ImportService";


import {
    createImportExportRepository,
} from "@/repositories/crm/ImportExportRepository";


import type {
    ImportRequest,
    ImportExecutionResult,
} from "@/types/crm/ImportExport";



interface ImportPayload
    extends ImportRequest {

    content: string;

    columns: {

        key: string;

        label: string;

        required: boolean;

    }[];

}



export async function POST(
    request: NextRequest,
) {

    try {

        const {
            supabase,
        } =
            await requireAdmin();


const payload = await request.json() as ImportPayload;

        if (
            !payload.entityType
            ||
            !payload.content
        ) {

            return Response.json(

                {

                    success: false,

                    message:
                        "Invalid import request.",

                },

                {
                    status:400,
                },

            );

        }



        const service =
            new ImportService();



        const result:
            ImportExecutionResult =

            await service.execute({

                content:
                    payload.content,

                format:
                    payload.format,

                columns:
                    payload.columns,

            });



        const repository =
            createImportExportRepository(
                supabase,
            );



        await repository.createImportJob({

            entityType:
                payload.entityType,

            fileName:
                payload.fileName,

            format:
                payload.format,

            status:
                result.failedRows > 0
                    ? "Failed"
                    : "Completed",

            totalRows:
                result.totalRows,

            processedRows:
                result.totalRows,

            successRows:
                result.importedRows,

            failedRows:
                result.failedRows,

        });



        return Response.json({

            success:true,

            result,

        });


    }

    catch(error: unknown) {


        return Response.json(

            {

                success:false,

                message:

                    error instanceof Error

                        ? error.message

                        : "Import execution failed.",

            },

            {

                status:500,

            },

        );

    }

}