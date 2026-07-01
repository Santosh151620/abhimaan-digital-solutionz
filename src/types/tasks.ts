import type { EntityReference } from "./base";

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

export interface Task extends EntityReference {
  id: string;

  title: string;
  description?: string;

  status: TaskStatus;
  priority: TaskPriority;

  dueDate?: string | null;

  assignedTo?: string | null;

  createdAt: string;
  updatedAt: string;

  createdBy?: string | null;
  updatedBy?: string | null;
}