import type {
    ImportValidationError,
} from "@/types/crm/ImportExport";

export class ImportErrorReportService {

    generateCSV(
        errors: ImportValidationError[],
    ): string {

        const rows = [

            "Row,Column,Message",

            ...errors.map(error =>

                `${error.row},"${error.column}","${error.message}"`

            ),

        ];

        return rows.join("\n");

    }

    hasErrors(
        errors: ImportValidationError[],
    ): boolean {

        return errors.length > 0;

    }

}

export const ImportErrorReportServiceInstance =
    new ImportErrorReportService();