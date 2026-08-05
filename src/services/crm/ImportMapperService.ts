import type {
    ImportExportMapping,
} from "@/types/crm/ImportExport";

export class ImportMapperService {

    mapRow(

        row: Record<string, unknown>,

        mappings: ImportExportMapping[],

    ): Record<string, unknown> {

        const mapped: Record<string, unknown> = {};

        for (const mapping of mappings) {

            mapped[mapping.targetField] =

                row[mapping.sourceColumn];

        }

        return mapped;

    }

    mapRows(

        rows: Record<string, unknown>[],

        mappings: ImportExportMapping[],

    ): Record<string, unknown>[] {

        return rows.map(

            row =>

                this.mapRow(

                    row,

                    mappings,

                ),

        );

    }

    identity(

        rows: Record<string, unknown>[],

    ): Record<string, unknown>[] {

        return rows;

    }

    hasMappings(

        mappings?: ImportExportMapping[],

    ): boolean {

        return (

            mappings !== undefined

            &&

            mappings.length > 0

        );

    }

}

export const ImportMapper =
    new ImportMapperService();