//import { supabase } from "@/lib/supabase/supabaseClient";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/observability/logger";

const supabase = await createClient();
export type AuditEventType =
  | "workflow_created"
  | "workflow_updated"
  | "workflow_completed"
  | "crm_event_processed"
  | "task_generated"
  | "tenant_access"
  | "system_error";

export interface AuditEvent {
  organizationId: string;
  userId?: string;
  type: AuditEventType;
  entityId?: string;
  payload?: Record<string, unknown>;
}

/**
 * Audit System (Production Observability Layer)
 *
 * Stores critical business events for:
 * - debugging
 * - compliance
 * - AI training signals (future)
 */
export class AuditService {
  private table = "workflow_task_events";

  async log(event: AuditEvent): Promise<void> {
    try {
      await supabase.from(this.table).insert({
        organization_id: event.organizationId,
        event_type: event.type,
        task_id: event.entityId,
        payload: event.payload ?? {},
      });

      logger.info("Audit event recorded", {
        module: "audit",
        organizationId: event.organizationId,
        meta: event as unknown as Record<string, unknown>,
      });
    } catch (err) {
      logger.error("Audit logging failed", {
        module: "audit",
        meta: event as unknown as Record<string, unknown>,
      });
    }
  }
}