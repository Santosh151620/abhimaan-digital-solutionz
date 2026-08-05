import type {
        ImportValidationError,
} from "@/types/crm/ImportExport";

export class ImportValidationService {

    validateRequired(

        row: Record<string, unknown>,

        required: string[],

        rowNumber: number,

    ): ImportValidationError[] {

        const errors: ImportValidationError[] = [];

        for (const field of required) {

            const value = row[field];

            if (

                value === undefined ||

                value === null ||

                value === ""

            ) {

                errors.push({

                    row: rowNumber,

                    column: field,

                    message: "Required field",

                });

            }

        }

        return errors;

    }

    validateColumns(

        headers: string[],

        required: string[],

    ): ImportValidationError[] {

        const errors: ImportValidationError[] = [];

        for (const column of required) {

            if (!headers.includes(column)) {

                errors.push({

                    row: 0,

                    column,

                    message: "Required column missing",

                });

            }

        }

        return errors;

    }

    validateDuplicateHeaders(

        headers: string[],

    ): ImportValidationError[] {

        const errors: ImportValidationError[] = [];

        const seen = new Set<string>();

        for (const header of headers) {

            if (seen.has(header)) {

                errors.push({

                    row: 0,

                    column: header,

                    message: "Duplicate column",

                });

            }

            seen.add(header);

        }

        return errors;

    }

    validateRow(

        row: Record<string, unknown>,

        required: string[],

        rowNumber: number,

    ): ImportValidationError[] {

        return this.validateRequired(

            row,

            required,

            rowNumber,

        );

    }

    validateRows(

        rows: Record<string, unknown>[],

        required: string[],

    ): ImportValidationError[] {

        const errors: ImportValidationError[] = [];

        rows.forEach(

            (row, index) => {

                errors.push(

                    ...this.validateRow(

                        row,

                        required,

                        index + 1,

                    ),

                );

            },

        );

        return errors;

    }

    hasErrors(

        errors: ImportValidationError[],

    ): boolean {

        return errors.length > 0;

    }

}