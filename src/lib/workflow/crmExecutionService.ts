import {
  WorkflowTask,
  WorkflowPriority,
  WorkflowType,
  WorkflowSource,
} from "@/types/workflow";

import { logger } from "@/lib/observability/logger";
import { AuditService } from "@/lib/observability/audit";

export type CRMEventType =
  | "lead_created"
  | "lead_follow_up_required"
  | "deal_stage_changed"
  | "client_onboarded"
  | "proposal_sent"
  | "payment_pending";

export interface CRMEvent {
  type: CRMEventType;
  entityId: string;
  entityType: "lead" | "client" | "deal";
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export class CRMExecutionService {
  private audit = new AuditService();

  public generateTasks(event: CRMEvent): WorkflowTask[] {
    logger.info("CRM event received", {
      module: "CRMExecutionService",
      meta: event as unknown as Record<string, unknown>,
    });

    const tasks = this.routeEvent(event);

    this.audit.log({
      organizationId: "demo-org",
      type: "crm_event_processed",
      entityId: event.entityId,
      payload: {
        eventType: event.type,
        tasksGenerated: tasks.length,
      },
    });

    return tasks;
  }

  private routeEvent(event: CRMEvent): WorkflowTask[] {
    switch (event.type) {
      case "lead_created":
        return this.handleLeadCreated(event);

      case "lead_follow_up_required":
        return this.handleLeadFollowUp(event);

      case "deal_stage_changed":
        return this.handleDealStageChange(event);

      case "client_onboarded":
        return this.handleClientOnboarded(event);

      case "proposal_sent":
        return this.handleProposalSent(event);

      case "payment_pending":
        return this.handlePaymentPending(event);

      default:
        return [];
    }
  }

  private handleLeadCreated(
    event: CRMEvent
  ): WorkflowTask[] {
    return [
      this.createTask({
        title: "Follow up new lead",
        type: "follow_up",
        priority: "high",
        source: "lead",
        contextId: event.entityId,
      }),
    ];
  }

  private handleLeadFollowUp(
    event: CRMEvent
  ): WorkflowTask[] {
    return [
      this.createTask({
        title: "Follow up lead",
        type: "call",
        priority: "urgent",
        source: "lead",
        contextId: event.entityId,
      }),
    ];
  }

  private handleDealStageChange(
    event: CRMEvent
  ): WorkflowTask[] {
    const stage =
      typeof event.metadata?.stage === "string"
        ? event.metadata.stage
        : undefined;

    if (stage === "proposal") {
      return [
        this.createTask({
          title: "Send proposal follow-up",
          type: "proposal",
          priority: "high",
          source: "client",
          contextId: event.entityId,
        }),
      ];
    }

    if (stage === "negotiation") {
      return [
        this.createTask({
          title: "Negotiate deal terms",
          type: "meeting",
          priority: "urgent",
          source: "client",
          contextId: event.entityId,
        }),
      ];
    }

    return [];
  }

  private handleClientOnboarded(
    event: CRMEvent
  ): WorkflowTask[] {
    return [
      this.createTask({
        title: "Onboarding checklist",
        type: "task",
        priority: "medium",
        source: "client",
        contextId: event.entityId,
      }),
    ];
  }

  private handleProposalSent(
    event: CRMEvent
  ): WorkflowTask[] {
    return [
      this.createTask({
        title: "Follow up proposal response",
        type: "follow_up",
        priority: "high",
        source: "client",
        contextId: event.entityId,
      }),
    ];
  }

  private handlePaymentPending(
    event: CRMEvent
  ): WorkflowTask[] {
    return [
      this.createTask({
        title: "Payment follow-up required",
        type: "reminder",
        priority: "urgent",
        source: "system",
        contextId: event.entityId,
      }),
    ];
  }

  private createTask(input: {
    title: string;
    type: WorkflowType;
    priority: WorkflowPriority;
    source: WorkflowSource;
    contextId: string;
  }): WorkflowTask {
    const now = new Date().toISOString();

    return {
      id: `${input.contextId}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      title: input.title,
      type: input.type,
      status: "pending",
      priority: input.priority,
      source: input.source,
      context: {
        leadId:
          input.source === "lead"
            ? input.contextId
            : undefined,
        clientId:
          input.source === "client"
            ? input.contextId
            : undefined,
      },
      createdAt: now,
      updatedAt: now,
    };
  }
}