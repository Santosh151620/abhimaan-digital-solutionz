import {
    filterRepository,
} from "@/repositories/crm/FilterRepository";

import type {
    FilterDefinition,
    SavedFilter,
} from "@/types/crm/Filter";

export class FilterService {

    async create(
        filter: FilterDefinition,
    ): Promise<FilterDefinition> {

        this.validate(filter);

        return filterRepository.create(
            filter,
        );

    }

    async update(
        id: string,
        filter: Partial<FilterDefinition>,
    ): Promise<FilterDefinition> {

        return filterRepository.update(
            id,
            filter,
        );

    }

    async delete(
        id: string,
    ): Promise<void> {

        return filterRepository.delete(
            id,
        );

    }

    async getSavedFilters(
        entityType: string,
    ): Promise<SavedFilter[]> {

        return filterRepository.findByEntity(
            entityType,
        );

    }

    async getSavedFilter(
        id: string,
    ): Promise<SavedFilter | null> {

        return filterRepository.findById(
            id,
        );

    }

    validate(
        filter: FilterDefinition,
    ): void {

        if (!filter.entityType) {

            throw new Error(
                "Filter entityType is required",
            );

        }

        if (
            !filter.groups ||
            filter.groups.length === 0
        ) {

            throw new Error(
                "Filter groups are required",
            );

        }

        for (
            const group of filter.groups
        ) {

            if (
                !group.conditions ||
                group.conditions.length === 0
            ) {

                throw new Error(
                    "Filter group must contain conditions",
                );

            }

        }

    }

    apply<T extends Record<string, unknown>>(

    rows: T[],

    filters: Record<string, unknown>,

): T[] {

    return rows.filter(

        row => {

            for (

                const [key, value]

                of Object.entries(filters)

            ) {

                if (

                    value === undefined ||

                    value === null ||

                    value === ""

                ) {

                    continue;

                }

                if (

                    String(

                        row[key] ?? "",

                    ).toLowerCase()

                    !==

                    String(value)

                        .toLowerCase()

                ) {

                    return false;

                }

            }

            return true;

        },

    );

}

}

export const FilterServiceInstance =
    new FilterService();

/**
 * Backward compatibility.
 * Existing modules can continue importing
 * filterService while newer modules use
 * FilterServiceInstance.
 */
export const filterService =
    FilterServiceInstance;