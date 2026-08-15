import type {
    Notification,
} from "@/types/crm/Notifications";

import type {
    SupabaseClient,
} from "@supabase/supabase-js";

import {
    createNotificationsRepository,
} from "@/repositories/crm/NotificationsRepository";


/**
 * ============================================================================
 * NOTIFICATIONS SERVICE
 * ============================================================================
 *
 * CRM application-service boundary for notification operations.
 *
 * Responsibilities:
 *
 * - Validate notification entity references.
 * - Delegate notification persistence/query operations to the canonical
 *   NotificationsRepository.
 * - Preserve dependency injection through the existing Supabase client.
 * - Provide a stable service factory for existing consumers.
 *
 * IMPORTANT:
 *
 * This service does NOT:
 *
 * - access database tables directly
 * - bypass NotificationsRepository
 * - implement tenant context independently
 * - duplicate RLS/security rules
 * - introduce a second notification persistence mechanism
 *
 * The supplied Supabase client and NotificationsRepository remain responsible
 * for authentication, organization context, authorization and RLS enforcement.
 * ============================================================================
 */


function requireEntityReference(
    entityType: string,
    entityId: string,
): {
    entityType: string;
    entityId: string;
} {

    if (
        typeof entityType !== "string" ||
        entityType.trim().length === 0
    ) {

        throw new Error(
            "NotificationsService: entityType is required.",
        );

    }


    if (
        typeof entityId !== "string" ||
        entityId.trim().length === 0
    ) {

        throw new Error(
            "NotificationsService: entityId is required.",
        );

    }


    return {

        entityType:
            entityType.trim(),

        entityId:
            entityId.trim(),

    };

}


function requireNotificationInput(
    notification: Partial<Notification>,
): Partial<Notification> {

    if (
        !notification ||
        typeof notification !== "object"
    ) {

        throw new TypeError(
            "NotificationsService: notification is required.",
        );

    }


    return notification;

}


export class NotificationsService {

    private readonly repository:
        ReturnType<
            typeof createNotificationsRepository
        >;


    constructor(
        supabase: SupabaseClient,
    ) {

        if (!supabase) {

            throw new Error(
                "NotificationsService: Supabase client is required.",
            );

        }


        this.repository =
            createNotificationsRepository(
                supabase,
            );

    }


    /**
     * Returns notifications associated with an entity.
     *
     * Entity identifiers are normalized before crossing the repository
     * boundary.
     */
    async getByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Notification[]> {

        const reference =
            requireEntityReference(
                entityType,
                entityId,
            );


        return this.repository.findByEntity(
            reference.entityType,
            reference.entityId,
        );

    }


    /**
     * Creates a notification through the canonical repository boundary.
     *
     * The repository remains responsible for persistence and database-level
     * security constraints.
     */
    async create(
        notification: Partial<Notification>,
    ): Promise<Notification> {

        const validatedNotification =
            requireNotificationInput(
                notification,
            );


        return this.repository.create(
            validatedNotification,
        );

    }

}


/**
 * ============================================================================
 * SERVICE FACTORY
 * ============================================================================
 *
 * Existing factory preserved for dependency-injected consumers and tests.
 */
export function createNotificationsService(
    supabase: SupabaseClient,
): NotificationsService {

    return new NotificationsService(
        supabase,
    );

}