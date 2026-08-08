/**
 * ============================================================================
 * ADS CRM Attachments Type Contract
 * ============================================================================
 *
 * Compatibility/public contract for the CRM attachment engine.
 *
 * IMPORTANT:
 * - The existing singular Attachment.ts remains the canonical domain model.
 * - This file provides the plural import surface used by CRM UI/actions.
 * - Do NOT duplicate Attachment domain definitions here.
 * - All consumers therefore resolve to one source of truth.
 *
 * Architecture:
 *   UI / Server Actions
 *          |
 *          v
 *   Attachments.ts
 *          |
 *          v
 *   Attachment.ts
 *          |
 *          v
 *   AttachmentRepository
 *          |
 *          v
 *   Supabase attachments
 *
 * Entity model:
 *   entityType + entityId
 *
 * Tenant isolation:
 *   organization_id + RLS
 *
 * ============================================================================
 */

export type {
    Attachment,
    AttachmentEntityType,
    AttachmentSearchFilters,
    AttachmentSummary,
    AttachmentVersion,
    CreateAttachmentRequest,
    UpdateAttachmentRequest,
} from "./Attachment";

/**
 * Explicit compatibility aliases.
 *
 * These aliases intentionally point to the canonical singular contract.
 * They exist so plural CRM imports do not create a second domain model.
 */
export type {
    Attachment as Attachments,
    AttachmentSearchFilters as AttachmentsSearchFilters,
    AttachmentSummary as AttachmentsSummary,
} from "./Attachment";
