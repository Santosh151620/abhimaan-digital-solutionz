import type { EntityReference } from "@/types/platform/Ownership";

export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "DONE"
  | "BLOCKED";

export type TaskPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT";

import type { BaseEntity } from "@/types/platform/BaseEntity";

export interface Task
  extends BaseEntity,
  EntityReference {
  entityType: BaseEntity["entityType"] & EntityReference["entityType"];
  id: string;

  title: string;
  description?: string;

  status: TaskStatus;
  priority: TaskPriority;

  dueDate?: string | null;

  assignedTo?: string | null;

}






