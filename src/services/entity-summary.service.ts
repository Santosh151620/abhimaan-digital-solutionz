import type { EntitySummary } from "@/types/entity";

/**
 * ============================================================================
 * ENTITY SUMMARY SERVICE
 * ============================================================================
 *
 * Canonical domain service for creating a safe, empty entity-summary snapshot.
 *
 * Responsibilities:
 *
 * - Provide one stable EntitySummary shape.
 * - Normalize the entity identity at the service boundary.
 * - Guarantee all summary counters start at zero.
 * - Remain persistence-agnostic.
 *
 * This service intentionally does NOT access Supabase or repositories.
 * Entity-specific counts must be populated by the appropriate repository/
 * service layer when real summary data is required.
 *
 * IMPORTANT:
 *
 * Do not introduce database access here merely to calculate counts.
 * Keeping this service pure makes it safe to reuse from server actions,
 * API handlers and other server-side domain services.
 * ============================================================================
 */

const EMPTY_COUNT = 0;

function requireEntityIdentifier(
    value: string,
    fieldName: "entityType" | "entityId",
): string {

    const normalized =
        value.trim();

    if (!normalized) {

        throw new Error(
            `EntitySummaryService: ${fieldName} is required.`,
        );

    }

    return normalized;
}


/**
 * Creates a zeroed EntitySummary for an entity.
 *
 * The method is intentionally synchronous because no persistence or I/O is
 * required to create an empty summary.
 */
export class EntitySummaryService {

    createEmptySummary(
        entityType: string,
        entityId: string,
    ): EntitySummary {

        const normalizedEntityType =
            requireEntityIdentifier(
                entityType,
                "entityType",
            );

        const normalizedEntityId =
            requireEntityIdentifier(
                entityId,
                "entityId",
            );

        return {

            entityType:
                normalizedEntityType,

            entityId:
                normalizedEntityId,

            activityCount:
                EMPTY_COUNT,

            notesCount:
                EMPTY_COUNT,

            tasksCount:
                EMPTY_COUNT,

            attachmentsCount:
                EMPTY_COUNT,

            notificationsCount:
                EMPTY_COUNT,

        };

    }

}