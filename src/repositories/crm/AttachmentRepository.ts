/**
 * ============================================================================
 * ADS CRM Attachment Repository
 * ============================================================================
 *
 * Production repository for the shared entity-driven attachment engine.
 *
 * Database model:
 *   attachments
 *
 * Tenant boundary:
 *   organization_id
 *
 * Entity boundary:
 *   entity_type + entity_id
 *
 * IMPORTANT:
 * - No module-specific foreign keys.
 * - No in-memory persistence.
 * - No hard delete.
 * - Database/RLS remains the authoritative security boundary.
 * - Repository explicitly applies organization_id for defense in depth.
 * - DB snake_case is mapped to the application camelCase contract.
 *
 * ============================================================================
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import {
  BaseRepository,
} from "@/lib/db/base-repository";

import type {
  Attachment,
  AttachmentEntityType,
  AttachmentSearchFilters,
  AttachmentSummary,
} from "@/types/crm/Attachment";

interface AttachmentRow {
  id: string;
  organization_id: string;

  entity_type: string;
  entity_id: string;

  file_name: string;
  file_url: string;
  storage_path: string | null;

  file_type: string;
  mime_type: string | null;
  file_size: number | null;
  checksum: string | null;

  description: string | null;

  uploaded_by: string | null;
  uploaded_at: string;

  version: number | null;
  parent_attachment_id: string | null;

  preview_allowed: boolean | null;
  download_allowed: boolean | null;

  archived: boolean;
  is_deleted: boolean | null;

  deleted_at: string | null;
  deleted_by: string | null;

  created_at: string;
  updated_at: string;
}

function mapAttachment(
  row: AttachmentRow,
): Attachment {
  return {
    id: row.id,

    entityType:
      row.entity_type as AttachmentEntityType,

    entityId:
      row.entity_id,

    fileName:
      row.file_name,

    fileUrl:
      row.file_url,

    storagePath:
      row.storage_path ?? undefined,

    fileType:
      row.file_type,

    mimeType:
      row.mime_type ?? undefined,

    fileSize:
      row.file_size ?? undefined,

    checksum:
      row.checksum ?? undefined,

    description:
      row.description ?? undefined,

    uploadedBy:
      row.uploaded_by ?? undefined,

    uploadedAt:
      row.uploaded_at,

    version:
      row.version ?? undefined,

    parentAttachmentId:
      row.parent_attachment_id ?? undefined,

    previewAllowed:
      row.preview_allowed ?? undefined,

    downloadAllowed:
      row.download_allowed ?? undefined,

    archived:
      row.archived,

    isDeleted:
      row.is_deleted ?? false,

    deletedAt:
      row.deleted_at ?? undefined,

    deletedBy:
      row.deleted_by ?? undefined,

    createdAt:
      row.created_at,

    updatedAt:
      row.updated_at,
  };
}

function toDatabasePayload(
  data: Partial<Attachment>,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  if (data.entityType !== undefined) {
    payload.entity_type =
      data.entityType;
  }

  if (data.entityId !== undefined) {
    payload.entity_id =
      data.entityId;
  }

  if (data.fileName !== undefined) {
    payload.file_name =
      data.fileName;
  }

  if (data.fileUrl !== undefined) {
    payload.file_url =
      data.fileUrl;
  }

  if (data.storagePath !== undefined) {
    payload.storage_path =
      data.storagePath;
  }

  if (data.fileType !== undefined) {
    payload.file_type =
      data.fileType;
  }

  if (data.mimeType !== undefined) {
    payload.mime_type =
      data.mimeType;
  }

  if (data.fileSize !== undefined) {
    payload.file_size =
      data.fileSize;
  }

  if (data.checksum !== undefined) {
    payload.checksum =
      data.checksum;
  }

  if (data.description !== undefined) {
    payload.description =
      data.description;
  }

  if (data.uploadedBy !== undefined) {
    payload.uploaded_by =
      data.uploadedBy;
  }

  if (data.uploadedAt !== undefined) {
    payload.uploaded_at =
      data.uploadedAt;
  }

  if (data.version !== undefined) {
    payload.version =
      data.version;
  }

  if (data.parentAttachmentId !== undefined) {
    payload.parent_attachment_id =
      data.parentAttachmentId;
  }

  if (data.previewAllowed !== undefined) {
    payload.preview_allowed =
      data.previewAllowed;
  }

  if (data.downloadAllowed !== undefined) {
    payload.download_allowed =
      data.downloadAllowed;
  }

  if (data.archived !== undefined) {
    payload.archived =
      data.archived;
  }

  if (data.isDeleted !== undefined) {
    payload.is_deleted =
      data.isDeleted;
  }

  if (data.deletedAt !== undefined) {
    payload.deleted_at =
      data.deletedAt;
  }

  if (data.deletedBy !== undefined) {
    payload.deleted_by =
      data.deletedBy;
  }

  if (data.createdAt !== undefined) {
    payload.created_at =
      data.createdAt;
  }

  if (data.updatedAt !== undefined) {
    payload.updated_at =
      data.updatedAt;
  }

  return payload;
}

export class AttachmentRepository
  extends BaseRepository<Attachment> {

  constructor(
    supabase: SupabaseClient,
  ) {
    super(
      supabase,
      "attachments",
    );
  }

  /**
   * List active attachments.
   */
  async list(
    entityType?: string,
    entityId?: string,
    includeArchived = false,
    includeDeleted = false,
  ): Promise<Attachment[]> {
    let query =
      this.tableRef()
        .select("*")
        .eq(
          "organization_id",
          this.organizationId,
        );

    if (!includeArchived) {
      query =
        query.eq(
          "archived",
          false,
        );
    }

    if (!includeDeleted) {
      query =
        query.or(
          "is_deleted.is.null,is_deleted.eq.false",
        );
    }

    if (entityType) {
      query =
        query.eq(
          "entity_type",
          entityType,
        );
    }

    if (entityId) {
      query =
        query.eq(
          "entity_id",
          entityId,
        );
    }

    const {
      data,
      error,
    } = await query.order(
      "uploaded_at",
      {
        ascending: false,
      },
    );

    if (error) {
      throw error;
    }

    return (
      (data ?? []) as AttachmentRow[]
    ).map(mapAttachment);
  }

  async findById(
    id: string,
  ): Promise<Attachment | null> {
    const {
      data,
      error,
    } =
      await this.tableRef()
        .select("*")
        .eq(
          "organization_id",
          this.organizationId,
        )
        .eq(
          "id",
          id,
        )
        .maybeSingle();

    if (error) {
      throw error;
    }

    return data
      ? mapAttachment(
          data as AttachmentRow,
        )
      : null;
  }

  async details(
    id: string,
  ): Promise<Attachment | null> {
    return this.findById(id);
  }

  async listByEntity(
    entityType: string,
    entityId: string,
  ): Promise<Attachment[]> {
    return this.list(
      entityType,
      entityId,
    );
  }

  async search(
    filters?: AttachmentSearchFilters,
  ): Promise<Attachment[]> {
    let query =
      this.tableRef()
        .select("*")
        .eq(
          "organization_id",
          this.organizationId,
        );

    if (filters?.entityType) {
      query =
        query.eq(
          "entity_type",
          filters.entityType,
        );
    }

    if (filters?.entityId) {
      query =
        query.eq(
          "entity_id",
          filters.entityId,
        );
    }

    if (filters?.uploadedBy) {
      query =
        query.eq(
          "uploaded_by",
          filters.uploadedBy,
        );
    }

    if (filters?.fileType) {
      query =
        query.eq(
          "file_type",
          filters.fileType,
        );
    }

    if (filters?.mimeType) {
      query =
        query.eq(
          "mime_type",
          filters.mimeType,
        );
    }

    if (!filters?.includeArchived) {
      query =
        query.eq(
          "archived",
          false,
        );
    }

    if (!filters?.includeDeleted) {
      query =
        query.or(
          "is_deleted.is.null,is_deleted.eq.false",
        );
    }

    const {
      data,
      error,
    } =
      await query.order(
        "uploaded_at",
        {
          ascending: false,
        },
      );

    if (error) {
      throw error;
    }

    let attachments =
      (
        (data ?? []) as AttachmentRow[]
      ).map(mapAttachment);

    if (filters?.search) {
      const keyword =
        filters.search
          .trim()
          .toLowerCase();

      if (keyword) {
        attachments =
          attachments.filter(
            (attachment) =>
              attachment.fileName
                .toLowerCase()
                .includes(keyword) ||
              attachment.fileType
                .toLowerCase()
                .includes(keyword) ||
              (
                attachment.mimeType ??
                ""
              )
                .toLowerCase()
                .includes(keyword) ||
              (
                attachment.description ??
                ""
              )
                .toLowerCase()
                .includes(keyword),
          );
      }
    }

    return attachments;
  }

  async create(
    data: Partial<Attachment>,
  ): Promise<Attachment> {
    const now =
      new Date().toISOString();

    const payload =
      toDatabasePayload({
        ...data,
        uploadedAt:
          data.uploadedAt ??
          now,
        createdAt:
          now,
        updatedAt:
          now,
        archived:
          data.archived ??
          false,
        isDeleted:
          data.isDeleted ??
          false,
      });

    const {
      data: created,
      error,
    } =
      await this.tableRef()
        .insert(
          this.withCreateTenant(
            payload,
          ),
        )
        .select("*")
        .single();

    if (error) {
      throw error;
    }

    return mapAttachment(
      created as AttachmentRow,
    );
  }

  async update(
    id: string,
    data: Partial<Attachment>,
  ): Promise<Attachment> {
    const existing =
      await this.findById(id);

    if (!existing) {
      throw new Error(
        "Attachment not found.",
      );
    }

    const payload =
      toDatabasePayload({
        ...data,
        updatedAt:
          new Date().toISOString(),
      });

    const {
      data: updated,
      error,
    } =
      await this.tableRef()
        .update(payload)
        .eq(
          "organization_id",
          this.organizationId,
        )
        .eq(
          "id",
          id,
        )
        .select("*")
        .single();

    if (error) {
      throw error;
    }

    return mapAttachment(
      updated as AttachmentRow,
    );
  }

  /**
   * Enterprise soft delete.
   *
   * Physical deletion is intentionally not performed.
   */
  async delete(
    id: string,
  ): Promise<void> {
    const existing =
      await this.findById(id);

    if (!existing) {
      return;
    }

    const now =
      new Date().toISOString();

    const {
      error,
    } =
      await this.tableRef()
        .update({
          archived: true,
          is_deleted: true,
          deleted_at: now,
          updated_at: now,
        })
        .eq(
          "organization_id",
          this.organizationId,
        )
        .eq(
          "id",
          id,
        );

    if (error) {
      throw error;
    }
  }

  async restore(
    id: string,
  ): Promise<Attachment | null> {
    const existing =
      await this.findById(id);

    if (!existing) {
      return null;
    }

    const {
      data,
      error,
    } =
      await this.tableRef()
        .update({
          archived: false,
          is_deleted: false,
          deleted_at: null,
          deleted_by: null,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "organization_id",
          this.organizationId,
        )
        .eq(
          "id",
          id,
        )
        .select("*")
        .single();

    if (error) {
      throw error;
    }

    return mapAttachment(
      data as AttachmentRow,
    );
  }

  async summary(): Promise<AttachmentSummary> {
    const attachments =
      await this.list(
        undefined,
        undefined,
        true,
        true,
      );

    const active =
      attachments.filter(
        (attachment) =>
          !attachment.archived &&
          !attachment.isDeleted,
      );

    const archived =
      attachments.filter(
        (attachment) =>
          attachment.archived &&
          !attachment.isDeleted,
      );

    const deleted =
      attachments.filter(
        (attachment) =>
          attachment.isDeleted === true,
      );

    const storageUsed =
      attachments.reduce(
        (total, attachment) =>
          total +
          (
            attachment.fileSize ??
            0
          ),
        0,
      );

    return {
      total:
        attachments.length,

      active:
        active.length,

      archived:
        archived.length,

      deleted:
        deleted.length,

      storageUsed,
    };
  }
}

export function createAttachmentRepository(
  supabase: SupabaseClient,
): AttachmentRepository {
  return new AttachmentRepository(
    supabase,
  );
}

/**
 * Deprecated compatibility surface.
 *
 * Attachment repositories require an authenticated Supabase context.
 * Call createAttachmentRepository(supabase) instead.
 */
export const AttachmentRepositoryInstance = {
  list(
    ...args: unknown[]
  ): never {
    void args;

    throw new Error(
      "AttachmentRepositoryInstance requires Supabase context. Use createAttachmentRepository(supabase).list().",
    );
  },

  listByEntity(
    ...args: unknown[]
  ): never {
    void args;

    throw new Error(
      "AttachmentRepositoryInstance requires Supabase context. Use createAttachmentRepository(supabase).listByEntity().",
    );
  },

  create(
    ...args: unknown[]
  ): never {
    void args;

    throw new Error(
      "AttachmentRepositoryInstance requires Supabase context. Use createAttachmentRepository(supabase).create().",
    );
  },

  delete(
    ...args: unknown[]
  ): never {
    void args;

    throw new Error(
      "AttachmentRepositoryInstance requires Supabase context. Use createAttachmentRepository(supabase).delete().",
    );
  },
};
