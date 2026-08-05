import type {
    ExportRequest,
} from "@/types/crm/ImportExport";

export class ExportService {

    exportToCSV(
        rows: Record<string, unknown>[],
    ): string {

        if (rows.length === 0) {
            return "";
        }

        const headers = Object.keys(rows[0]);

        const csv = [
            headers.join(","),

            ...rows.map(row =>
                headers
                    .map(header => {

                        const value = row[header];

                        if (
                            value === undefined ||
                            value === null
                        ) {
                            return "";
                        }

                        const text = String(value)
                            .replace(/"/g, "\"\"");

                        return `"${text}"`;

                    })
                    .join(",")
            ),
        ];

        return csv.join("\n");

    }

    exportToJSON(
        rows: unknown[],
    ): string {

        return JSON.stringify(
            rows,
            null,
            2,
        );

    }

    async execute(
        request: ExportRequest,
        rows: Record<string, unknown>[],
    ): Promise<string> {

        switch (request.format) {

            case "CSV":
                return this.exportToCSV(rows);

            case "JSON":
                return this.exportToJSON(rows);

            default:
                throw new Error(
                    `Unsupported export format: ${request.format}`,
                );

        }

    }

}

export const ExportServiceInstance =
    new ExportService();