/**
 * ============================================================================
 * ADS CRM Attachment Service
 * ============================================================================
 *
 * Production application service for CRM attachments.
 *
 * Architecture:
 *
 *   UI / Server Action
 *          |
 *          v
 *   AttachmentService
 *          |
 *          v
 *   AttachmentRepository
 *          |
 *          v
 *   Supabase / RLS
 *
 * IMPORTANT:
 * - No in-memory attachment persistence.
 * - No duplicate business storage.
 * - Tenant isolation is enforced by repository + RLS.
 * - Entity references use entityType + entityId.
 * ============================================================================
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import {
  AttachmentRepository,
  createAttachmentRepository,
} from "@/repositories/crm/AttachmentRepository";

import type {
  Attachment,
  AttachmentSearchFilters,
  AttachmentSummary,
} from "@/types/crm/Attachment";

export class AttachmentService {
  private readonly repository: AttachmentRepository;

  constructor(
    supabase: SupabaseClient,
  ) {
    this.repository =
      createAttachmentRepository(
        supabase,
      );
  }

  async list(
    entityType?: string,
    entityId?: string,
    includeArchived = false,
    includeDeleted = false,
  ): Promise<Attachment[]> {
    return this.repository.list(
      entityType,
      entityId,
      includeArchived,
      includeDeleted,
    );
  }

  async listByEntity(
    entityType: string,
    entityId: string,
  ): Promise<Attachment[]> {
    return this.repository.listByEntity(
      entityType,
      entityId,
    );
  }

  async details(
    id: string,
  ): Promise<Attachment | null> {
    return this.repository.findById(
      id,
    );
  }

  async findById(
    id: string,
  ): Promise<Attachment | null> {
    return this.repository.findById(
      id,
    );
  }

  async search(
    filters?: AttachmentSearchFilters,
  ): Promise<Attachment[]> {
    return this.repository.search(
      filters,
    );
  }

  async create(
    data: Partial<Attachment>,
  ): Promise<Attachment> {
    return this.repository.create(
      data,
    );
  }

  async update(
    id: string,
    data: Partial<Attachment>,
  ): Promise<Attachment> {
    return this.repository.update(
      id,
      data,
    );
  }

  async delete(
    id: string,
  ): Promise<void> {
    return this.repository.delete(
      id,
    );
  }

  async restore(
    id: string,
  ): Promise<Attachment | null> {
    return this.repository.restore(
      id,
    );
  }

  async summary(): Promise<AttachmentSummary> {
    return this.repository.summary();
  }
}

/**
 * Factory for server-side/service usage.
 *
 * A Supabase client must be supplied so the service operates
 * inside the authenticated tenant context.
 */
export function createAttachmentService(
  supabase: SupabaseClient,
): AttachmentService {
  return new AttachmentService(
    supabase,
  );
}
