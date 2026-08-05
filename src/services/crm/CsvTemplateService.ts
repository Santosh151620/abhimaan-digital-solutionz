import type {
    CsvTemplateColumn,
} from "@/types/crm/ImportExport";

export class CsvTemplateService {

    buildHeaders(

        columns: CsvTemplateColumn[],

    ): string {

        return columns
            .map(
                column => column.header,
            )
            .join(",");

    }

    buildSampleRow(

        columns: CsvTemplateColumn[],

    ): string {

        return columns
            .map(
                column => column.sample ?? "",
            )
            .join(",");

    }

    build(

        columns: CsvTemplateColumn[],

        includeSample = true,

    ): string {

        const rows: string[] = [];

        rows.push(

            this.buildHeaders(columns),

        );

        if (includeSample) {

            rows.push(

                this.buildSampleRow(columns),

            );

        }

        return rows.join("\n");

    }

    fileName(

        entity: string,

    ): string {

        return `${entity}_Template.csv`;

    }

}

export const CsvTemplate =
    new CsvTemplateService();