/**
 * ============================================================================
 * ADS CRM Attachments Service
 * ============================================================================
 *
 * Compatibility facade for existing plural-service imports.
 *
 * Canonical implementation:
 *   src/services/crm/AttachmentService.ts
 *
 * This class exists only to preserve the existing application/server-action
 * contract while ensuring there is a single production implementation.
 * ============================================================================
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import {
  AttachmentService,
} from "@/services/crm/AttachmentService";

import type {
  Attachment,
  AttachmentSearchFilters,
  AttachmentSummary,
} from "@/types/crm/Attachment";

export class AttachmentsService {
  private readonly service: AttachmentService;

  constructor(
    supabase: SupabaseClient,
  ) {
    this.service =
      new AttachmentService(
        supabase,
      );
  }

  async list(
    entityType?: string,
    entityId?: string,
    includeArchived = false,
    includeDeleted = false,
  ): Promise<Attachment[]> {
    return this.service.list(
      entityType,
      entityId,
      includeArchived,
      includeDeleted,
    );
  }

  async details(
    id: string,
  ): Promise<Attachment | null> {
    return this.service.details(
      id,
    );
  }

  async findByEntity(
    entityType: string,
    entityId: string,
  ): Promise<Attachment[]> {
    return this.service.listByEntity(
      entityType,
      entityId,
    );
  }

  async search(
    filters?: AttachmentSearchFilters,
  ): Promise<Attachment[]> {
    return this.service.search(
      filters,
    );
  }

  async create(
    payload: Partial<Attachment>,
  ): Promise<Attachment> {
    return this.service.create(
      payload,
    );
  }

  async update(
    id: string,
    payload: Partial<Attachment>,
  ): Promise<Attachment> {
    return this.service.update(
      id,
      payload,
    );
  }

  async delete(
    id: string,
  ): Promise<void> {
    return this.service.delete(
      id,
    );
  }

  async restore(
    id: string,
  ): Promise<Attachment | null> {
    return this.service.restore(
      id,
    );
  }

  async summary(): Promise<AttachmentSummary> {
    return this.service.summary();
  }
}
