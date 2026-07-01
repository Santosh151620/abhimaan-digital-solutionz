import type { EntityReference } from "./base";

export type ActivityType =
  | "NOTE_ADDED"
  | "TASK_CREATED"
  | "TASK_UPDATED"
  | "TASK_COMPLETED"
  | "ATTACHMENT_UPLOADED"
  | "ATTACHMENT_DELETED"
  | "STATUS_CHANGED"
  | "ENTITY_CREATED"
  | "ENTITY_UPDATED"
  | "ENTITY_DELETED"
  | "SYSTEM_EVENT";

export interface Activity extends EntityReference {
  id: string;

  type: ActivityType;

  title?: string;
  description?: string;

  metadata?: Record<string, unknown>;

  createdAt: string;
  createdBy?: string | null;
}