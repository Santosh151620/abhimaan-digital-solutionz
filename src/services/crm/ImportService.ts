import {
    ImportParserService,
} from "./ImportParserService";

import {
    ImportValidator,
} from "./ImportValidator";

import type {
    ImportExportColumn,
    ImportExportFormat,
    ImportValidationError,
    ImportExecutionResult,
} from "@/types/crm/ImportExport";

export interface ImportDuplicateProvider {

    isDuplicate(
        row: Record<string, string>,
    ): Promise<boolean>;

}

export interface ImportPersistenceProvider {

    save(
        row: Record<string, string>,
    ): Promise<void>;

}

export interface ImportExecutionOptions {

    content: string;

    format?: ImportExportFormat;

    columns: ImportExportColumn[];

    duplicateProvider?: ImportDuplicateProvider;

    persistenceProvider?: ImportPersistenceProvider;

}


export class ImportService {

    constructor(

        private readonly parser =
            new ImportParserService(),

        private readonly validator =
            new ImportValidator(),

    ) {}

    async execute(

        options: ImportExecutionOptions,

    ): Promise<ImportExecutionResult> {

        const rows =
            this.parser.parse(
                options.content,
                options.format ?? "CSV",
            );

        const errors: ImportValidationError[] = [];

        let processedRows = 0;
        let successRows = 0;
        let failedRows = 0;
        let duplicateRows = 0;
        let skippedRows = 0;

        for (
            let index = 0;
            index < rows.length;
            index++
        ) {

            const row = rows[index];

            processedRows++;

            const validationErrors =
                this.validator.validate(
                    row,
                    options.columns,
                    index + 1,
                );

            if (
                validationErrors.length > 0
            ) {

                failedRows++;

                errors.push(
                    ...validationErrors,
                );

                continue;

            }

            if (
                options.duplicateProvider
            ) {

                const duplicate =
                    await options
                        .duplicateProvider
                        .isDuplicate(row);

                if (duplicate) {

                    duplicateRows++;
                    skippedRows++;

                    continue;

                }

            }

            if (
                options.persistenceProvider
            ) {

                try {

                    await options
                        .persistenceProvider
                        .save(row);

                }

                catch {

                    failedRows++;

                    errors.push({

                        row:
                            index + 1,

                        column: "",

                        message:
                            "Failed to save record.",

                    });

                    continue;

                }

            }

            successRows++;

        }

      return {

    success:
        failedRows === 0,

    totalRows:
        rows.length,

    importedRows:
        successRows,

    updatedRows:
        0,

    skippedRows,

    duplicateRows,

    failedRows,

    durationMs:
        0,

    summary: {

        totalRows:
            rows.length,

        importedRows:
            successRows,

        updatedRows:
            0,

        skippedRows,

        duplicateRows,

        failedRows,

        executionTimeMs:
            0,

    },

    errors,

    validationErrors:
        errors,

    warnings:
        [],

};

    }

}

/**
 * Singleton instance for CRM orchestration.
 *
 * This service is intentionally stateless,
 * making it safe to reuse across all CRM modules.
 */
export const ImportServiceInstance =
    new ImportService();