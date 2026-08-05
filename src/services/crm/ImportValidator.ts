import type {
    ImportExportColumn,
    ImportValidationError,
} from "@/types/crm/ImportExport";

export class ImportValidator {

    validate(

        row: Record<string, unknown>,

        columns: ImportExportColumn[],

        rowNumber: number,

    ): ImportValidationError[] {

        const errors: ImportValidationError[] = [];

        for (const column of columns) {

            const value = row[column.key];

            if (

                column.required

                &&

                (
                    value === undefined
                    || value === null
                    || String(value).trim() === ""
                )

            ) {

                errors.push({

                    row: rowNumber,

                    column: column.key,

                    message: `${column.label} is required`,

                });

                continue;

            }

            if (

                value === undefined
                || value === null
                || String(value).trim() === ""

            ) {

                continue;

            }

            switch (column.type) {

                case "email":

                    if (

                        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(

                            String(value),

                        )

                    ) {

                        errors.push({

                            row: rowNumber,

                            column: column.key,

                            message: "Invalid email address",

                        });

                    }

                    break;

                case "phone":

                    if (

                        !/^[0-9()+\-\s]{6,20}$/.test(

                            String(value),

                        )

                    ) {

                        errors.push({

                            row: rowNumber,

                            column: column.key,

                            message: "Invalid phone number",

                        });

                    }

                    break;

                case "number":

                    if (

                        Number.isNaN(

                            Number(value),

                        )

                    ) {

                        errors.push({

                            row: rowNumber,

                            column: column.key,

                            message: "Invalid number",

                        });

                    }

                    break;

                case "boolean":

                    if (

                        ![

                            "true",

                            "false",

                            "1",

                            "0",

                            "yes",

                            "no",

                        ].includes(

                            String(value).toLowerCase(),

                        )

                    ) {

                        errors.push({

                            row: rowNumber,

                            column: column.key,

                            message: "Invalid boolean",

                        });

                    }

                    break;

                case "date":

                    if (

                        Number.isNaN(

                            Date.parse(

                                String(value),

                            ),

                        )

                    ) {

                        errors.push({

                            row: rowNumber,

                            column: column.key,

                            message: "Invalid date",

                        });

                    }

                    break;

            }

        }

        return errors;

    }

}