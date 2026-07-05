export const ENTITY_MODULES = [
  "activity",
  "notes",
  "tasks",
  "attachments",
  "notifications",
] as const;

export type EntityModule = (typeof ENTITY_MODULES)[number];

export const DEFAULT_PAGE_SIZE = 20;
