import type {
    ImportExportColumn,
} from "@/types/crm/ImportExport";

export class ImportTemplateService {

    generateCSV(
        columns: ImportExportColumn[],
    ): string {

        const headers = columns.map(
            column => column.label,
        );

        return `${headers.join(",")}\n`;

    }

    generateExampleRow(
        columns: ImportExportColumn[],
    ): string {

        const values = columns.map(column => {

            switch (column.type) {

                case "email":
                    return "user@example.com";

                case "phone":
                    return "+919999999999";

                case "number":
                    return "100";

                case "boolean":
                    return "TRUE";

                case "date":
                    return "2026-01-01";

                default:
                    return "";

            }

        });

        return values.join(",");

    }

    generateTemplate(
        columns: ImportExportColumn[],
        includeExample = true,
    ): string {

        let csv = this.generateCSV(columns);

        if (includeExample) {
            csv += this.generateExampleRow(columns);
        }

        return csv;

    }

}

export const ImportTemplateServiceInstance =
    new ImportTemplateService();