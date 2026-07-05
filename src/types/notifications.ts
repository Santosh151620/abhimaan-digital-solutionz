import type { EntityReference } from "./base";

export type NotificationType =
  | "INFO"
  | "SUCCESS"
  | "WARNING"
  | "ERROR"
  | "SYSTEM";

export interface Notification extends EntityReference {
  id: string;

  title: string;
  message: string;

  type: NotificationType;

  isRead: boolean;

  createdAt: string;
  readAt?: string | null;
}
