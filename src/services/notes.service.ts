import type { Note } from "@/types/crm/Notes";

import {
    NotesRepository,
} from "@/repositories/crm/NotesRepository";


/**
 * ============================================================================
 * NOTES SERVICE
 * ============================================================================
 *
 * CRM application service for note operations.
 *
 * Responsibilities:
 *
 * - Expose the application-level note contract.
 * - Validate entity references before repository access.
 * - Delegate persistence to NotesRepository.
 * - Keep note business behavior above the persistence layer.
 *
 * IMPORTANT:
 *
 * This service does NOT:
 *
 * - access Supabase directly
 * - bypass NotesRepository
 * - implement tenant resolution
 * - implement RLS
 * - duplicate repository persistence logic
 *
 * Tenant isolation and persistence authorization remain enforced by the
 * repository/database security boundary.
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
            "NotesService: entityType is required.",
        );

    }


    if (
        typeof entityId !== "string" ||
        entityId.trim().length === 0
    ) {

        throw new Error(
            "NotesService: entityId is required.",
        );

    }


    return {

        entityType:
            entityType.trim(),

        entityId:
            entityId.trim(),

    };

}


function requireNoteInput(
    note: Partial<Note>,
): Partial<Note> {

    if (
        !note ||
        typeof note !== "object"
    ) {

        throw new TypeError(
            "NotesService: note is required.",
        );

    }


    return note;

}


export class NotesService {

    constructor(
        private readonly repository:
            NotesRepository,
    ) {}


    /**
     * Returns notes associated with an entity.
     *
     * Entity identifiers are normalized before crossing the repository
     * boundary.
     */
    async getByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Note[]> {

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
     * Creates a note through the canonical repository boundary.
     *
     * The repository remains responsible for persistence, tenant context,
     * authorization and database-level constraints.
     */
    async create(
        note: Partial<Note>,
    ): Promise<Note> {

        const validatedNote =
            requireNoteInput(note);


        return this.repository.create(
            validatedNote,
        );

    }

}