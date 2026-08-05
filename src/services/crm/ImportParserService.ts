import type {
    ImportExportFormat,
} from "@/types/crm/ImportExport";

export class ImportParserService {

    parse(

        content: string,

        format: ImportExportFormat = "CSV",

    ): Record<string, string>[] {

        switch (format) {

            case "CSV":

                return this.parseCsv(content);

            case "JSON":

                return this.parseJson(content);

            case "Excel":

                throw new Error(
                    "Excel parser not implemented yet.",
                );

            default:

                return [];

        }

    }

    private parseCsv(

        content: string,

    ): Record<string, string>[] {

        const lines =

            content
                .replace(/\r/g, "")
                .split("\n")
                .filter(Boolean);

        if (lines.length === 0) {

            return [];

        }

        const headers =

            lines[0]
                .split(",")
                .map(
                    item => item.trim(),
                );

        const rows: Record<string, string>[] = [];

        for (

            let i = 1;

            i < lines.length;

            i++

        ) {

            const values =

                lines[i]
                    .split(",");

            const row: Record<string, string> = {};

            headers.forEach(

                (header, index) => {

                    row[header] =

                        values[index]?.trim()

                        ?? "";

                },

            );

            rows.push(row);

        }

        return rows;

    }

    private parseJson(

        content: string,

    ): Record<string, string>[] {

        const parsed = JSON.parse(content);

        if (

            Array.isArray(parsed)

        ) {

            return parsed;

        }

        return [];

    }

}