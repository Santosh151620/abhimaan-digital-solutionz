import type {
    ImportExecutionResult,
} from "@/types/crm/ImportExport";

export class ImportExecutionReportService {

    createTextReport(
        result: ImportExecutionResult,
    ): string {

        const summary = result.summary;

        return [
            "IMPORT EXECUTION SUMMARY",
            "========================",
            "",
            `Status           : ${result.success ? "SUCCESS" : "FAILED"}`,
            `Total Rows       : ${summary.totalRows}`,
            `Imported         : ${summary.importedRows}`,
            `Updated          : ${summary.updatedRows}`,
            `Skipped          : ${summary.skippedRows}`,
            `Duplicates       : ${summary.duplicateRows}`,
            `Failed           : ${summary.failedRows}`,
            `Execution (ms)   : ${summary.executionTimeMs}`,
            `Validation Errors: ${result.validationErrors.length}`,
        ].join("\n");

    }

    hasErrors(
        result: ImportExecutionResult,
    ): boolean {

        return result.validationErrors.length > 0;

    }

}

export const ImportExecutionReportServiceInstance =
    new ImportExecutionReportService();