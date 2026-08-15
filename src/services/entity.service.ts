import type { EntitySummary } from "@/types/entity";


/**
 * ============================================================================
 * ENTITY SUMMARY SERVICE
 * ============================================================================
 *
 * Shared, module-independent entity summary foundation.
 *
 * Responsibilities:
 *
 * - Create a deterministic empty summary for any supported entity.
 * - Preserve the canonical EntitySummary contract.
 * - Normalize entity references at the shared-service boundary.
 * - Prevent invalid entity identifiers from entering shared summaries.
 *
 * IMPORTANT:
 *
 * This service intentionally contains NO:
 *
 * - database access
 * - Supabase access
 * - tenant resolution
 * - authentication
 * - authorization
 * - module-specific business rules
 *
 * Entity-specific counts must be populated by the appropriate repository or
 * module/service layer.
 * ============================================================================
 */


function normalizeRequiredValue(
    value: string,
    fieldName: string,
): string {

    if (
        typeof value !== "string"
    ) {

        throw new TypeError(
            `${fieldName} must be a string.`,
        );

    }


    const normalized =
        value.trim();


    if (
        normalized.length === 0
    ) {

        throw new Error(
            `${fieldName} must not be empty.`,
        );

    }


    return normalized;

}


export class EntitySummaryService {

    /**
     * Creates a deterministic empty summary for an entity.
     *
     * Counts are intentionally initialized to zero. This method does not
     * query persistence and therefore remains safe for use as a shared
     * foundation across CRM and future modules.
     */
    createEmptySummary(
        entityType: string,
        entityId: string,
    ): EntitySummary {

        const normalizedEntityType =
            normalizeRequiredValue(
                entityType,
                "entityType",
            );

        const normalizedEntityId =
            normalizeRequiredValue(
                entityId,
                "entityId",
            );


        return {

            entityType:
                normalizedEntityType,

            entityId:
                normalizedEntityId,

            activityCount: 0,

            notesCount: 0,

            tasksCount: 0,

            attachmentsCount: 0,

            notificationsCount: 0,

        };

    }

}