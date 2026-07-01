import type { EntityType } from "./base";

export interface EntityRecord {
  id: string;
  entityType: EntityType;

  title?: string;
  name?: string;
  code?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface EntitySummary {
  entityType: EntityType;
  entityId: string;

  activityCount: number;
  notesCount: number;
  tasksCount: number;
  attachmentsCount: number;
  notificationsCount: number;
}