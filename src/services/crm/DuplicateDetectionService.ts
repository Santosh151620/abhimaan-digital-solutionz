export interface DuplicateCheckOptions {

    existingRows: Record<string, unknown>[];

    incomingRow: Record<string, unknown>;

    uniqueFields: string[];

}

export interface DuplicateCheckResult {

    duplicate: boolean;

    matchedField?: string;

    matchedValue?: unknown;

}

export class DuplicateDetectionService {

    check(
        options: DuplicateCheckOptions,
    ): DuplicateCheckResult {

        for (const field of options.uniqueFields) {

            const value =
                options.incomingRow[field];

            if (
                value === undefined ||
                value === null ||
                value === ""
            ) {

                continue;

            }

            const duplicate =
                options.existingRows.find(
                    row =>
                        row[field] === value,
                );

            if (duplicate) {

                return {

                    duplicate: true,

                    matchedField: field,

                    matchedValue: value,

                };

            }

        }

        return {

            duplicate: false,

        };

    }

}

export const DuplicateDetectionServiceInstance =
    new DuplicateDetectionService();