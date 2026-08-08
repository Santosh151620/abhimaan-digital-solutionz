/**
 * CRM Notes Repository
 *
 * Production repository for the shared entity-driven notes engine.
 *
 * Database table:
 *   notes
 *
 * Tenant model:
 *   notes.created_by
 *      -> organization_members.profile_id
 *      -> organization_members.organization_id
 *
 * IMPORTANT:
 * The notes table does NOT contain organization_id or archived.
 * Do not use BaseRepository for this table.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { TenantContextManager } from "@/lib/tenant/tenantContext";

import type {
  Note,
  NoteEntityType,
  NoteSummary,
} from "@/types/crm/Notes";

interface NoteRow {
  id: string;
  entity_type: string;
  entity_id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface CreateNoteInput {
  entityType: NoteEntityType;
  entityId: string;
  title?: string;
  content?: string;
  isPinned?: boolean;
  createdBy?: string;
}

interface UpdateNoteInput {
  entityType?: NoteEntityType;
  entityId?: string;
  title?: string;
  content?: string;
  isPinned?: boolean;
}

function mapNote(row: NoteRow): Note {
  return {
    id: row.id,

    entityType: row.entity_type as NoteEntityType,

    entityId: row.entity_id,

    title: row.title,

    content: row.content,

    createdBy: row.created_by,

    archived: false,

    createdAt: row.created_at,

    updatedAt: row.updated_at,
  };
}

export class NotesRepository {
  private readonly supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  private get organizationId(): string {
    return TenantContextManager.require().organizationId;
  }

  /**
   * Resolve the current user's profile ID.
   *
   * RLS ultimately enforces:
   * created_by -> organization_members.profile_id
   * for the current authenticated organization.
   */
  private async currentProfileId(): Promise<string> {
    const {
      data: { user },
      error,
    } = await this.supabase.auth.getUser();

    if (error) {
      throw error;
    }

    if (!user) {
      throw new Error("Authentication required.");
    }

    const { data, error: profileError } = await this.supabase
      .from("organization_members")
      .select("profile_id")
      .eq("profile_id", user.id)
      .eq("organization_id", this.organizationId)
      .eq("is_active", true)
      .maybeSingle();

    if (profileError) {
      throw profileError;
    }

    if (!data) {
      throw new Error(
        "Authenticated user is not an active member of the current organization."
      );
    }

    return data.profile_id;
  }

  /**
   * Verify that a note belongs to the current organization.
   *
   * The actual database RLS remains the authoritative security boundary.
   * This additional lookup prevents accidental cross-tenant operations
   * from the application layer.
   */
  private async findOwnedRow(
    id: string
  ): Promise<NoteRow | null> {
    const profileId = await this.currentProfileId();

    const { data, error } = await this.supabase
      .from("notes")
      .select("*")
      .eq("id", id)
      .eq("created_by", profileId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return (data as NoteRow | null) ?? null;
  }

  async list(): Promise<Note[]> {
    const profileId = await this.currentProfileId();

    const { data, error } = await this.supabase
      .from("notes")
      .select("*")
      .eq("created_by", profileId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    return ((data ?? []) as NoteRow[]).map(mapNote);
  }

  /**
   * Legacy compatibility.
   *
   * The current notes schema has no archived column.
   * All existing notes are therefore treated as active.
   */
  async listArchived(): Promise<Note[]> {
    return [];
  }

  async findByEntity(
    entityType: string,
    entityId: string
  ): Promise<Note[]> {
    const profileId = await this.currentProfileId();

    const { data, error } = await this.supabase
      .from("notes")
      .select("*")
      .eq("created_by", profileId)
      .eq("entity_type", entityType)
      .eq("entity_id", entityId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    return ((data ?? []) as NoteRow[]).map(mapNote);
  }

  async findById(id: string): Promise<Note | null> {
    const row = await this.findOwnedRow(id);

    return row ? mapNote(row) : null;
  }

  async create(
    data: Partial<Note>
  ): Promise<Note> {
    const profileId =
      data.createdBy ??
      (await this.currentProfileId());

    const entityType =
      data.entityType ?? "Other";

    const entityId =
      data.entityId ?? "";

    if (!entityId) {
      throw new Error(
        "entityId is required when creating a note."
      );
    }

    const title =
      data.title ?? "";

    const content =
      data.content ?? "";

    const isPinned =
      data.archived === true
        ? false
        : false;

    const { data: created, error } =
      await this.supabase
        .from("notes")
        .insert({
          id: data.id ?? crypto.randomUUID(),

          entity_type: entityType,

          entity_id: entityId,

          title,

          content,

          is_pinned: isPinned,

          created_by: profileId,
        })
        .select("*")
        .single();

    if (error) {
      throw error;
    }

    return mapNote(created as NoteRow);
  }

  async update(
    id: string,
    data: Partial<Note>
  ): Promise<Note | null> {
    const existing = await this.findOwnedRow(id);

    if (!existing) {
      return null;
    }

    const payload: UpdateNoteInput = {};

    if (data.entityType !== undefined) {
      payload.entityType = data.entityType;
    }

    if (data.entityId !== undefined) {
      payload.entityId = data.entityId;
    }

    if (data.title !== undefined) {
      payload.title = data.title;
    }

    if (data.content !== undefined) {
      payload.content = data.content;
    }

    /**
     * The Note type currently exposes archived rather than isPinned.
     * Preserve existing callers without writing an invalid column.
     */
    const updatePayload: Record<string, unknown> = {};

    if (payload.entityType !== undefined) {
      updatePayload.entity_type = payload.entityType;
    }

    if (payload.entityId !== undefined) {
      updatePayload.entity_id = payload.entityId;
    }

    if (payload.title !== undefined) {
      updatePayload.title = payload.title;
    }

    if (payload.content !== undefined) {
      updatePayload.content = payload.content;
    }

    if (Object.keys(updatePayload).length === 0) {
      return mapNote(existing);
    }

    const { data: updated, error } =
      await this.supabase
        .from("notes")
        .update(updatePayload)
        .eq("id", id)
        .eq("created_by", existing.created_by)
        .select("*")
        .single();

    if (error) {
      throw error;
    }

    return mapNote(updated as NoteRow);
  }

  /**
   * Notes currently have no archived column.
   *
   * Keep compatibility with existing service callers without
   * pretending an archive operation exists in the database.
   */
  async archive(
    id: string
  ): Promise<Note | null> {
    return this.findById(id);
  }

  async restore(
    id: string
  ): Promise<Note | null> {
    return this.findById(id);
  }

  /**
   * Existing application contract uses delete() as a soft-delete.
   *
   * The current database has no deleted/archived column, therefore
   * physical deletion is intentionally NOT performed here.
   *
   * This is a compatibility no-op until the governed notes lifecycle
   * schema is introduced.
   */
  async delete(
    id: string
  ): Promise<void> {
    const existing = await this.findOwnedRow(id);

    if (!existing) {
      return;
    }

    throw new Error(
      "Note deletion is not supported by the current notes schema."
    );
  }

  async summary(): Promise<NoteSummary> {
    const notes = await this.list();

    return {
      total: notes.length,
      active: notes.length,
      archived: 0,
    };
  }
}

/**
 * Repository factory.
 */
export function createNotesRepository(
  supabase: SupabaseClient
): NotesRepository {
  return new NotesRepository(supabase);
}

/**
 * Compatibility export.
 */
export const NotesRepositoryInstance =
  createNotesRepository;