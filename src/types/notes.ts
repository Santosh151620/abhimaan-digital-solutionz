import type { EntityReference } from "./base";

export interface Note extends EntityReference {
  id: string;

  title?: string;
  content: string;

  isPinned: boolean;

  createdAt: string;
  updatedAt: string;

  createdBy?: string | null;
  updatedBy?: string | null;
}