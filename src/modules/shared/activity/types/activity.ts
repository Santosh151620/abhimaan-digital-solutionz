export type ActivityModule =
  | "crm"
  | "hr"
  | "projects"
  | "finance"
  | "inventory"
  | "support"
  | "marketing"
  | "assets"
  | "documents"
  | (string & {});

export type ActivityEntityType =
  | "lead"
  | "client"
  | "employee"
  | "project"
  | "invoice"
  | "asset"
  | "ticket"
  | "document"
  | (string & {});

export type ActivityEventType =
  | "created"
  | "updated"
  | "deleted"
  | "status_changed"
  | "assigned"
  | "comment"
  | "note"
  | "email"
  | "call"
  | "meeting"
  | "task"
  | "attachment"
  | "custom"
  | (string & {});

export interface ActivityActor {
  id?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
}

export interface ActivityItem {
  id: string;

  organization_id: string;

  module: ActivityModule;

  entity_type: ActivityEntityType;

  entity_id: string;

  event_type: ActivityEventType;

  title: string;

  description?: string | null;

  metadata?: Record<string, unknown> | null;

  actor?: ActivityActor | null;

  created_at: string;
}

export interface CreateActivityInput {
  module: ActivityModule;

  entity_type: ActivityEntityType;

  entity_id: string;

  event_type: ActivityEventType;

  title: string;

  description?: string | null;

  metadata?: Record<string, unknown>;
}

export interface ActivityFilter {
  module?: ActivityModule;

  entity_type?: ActivityEntityType;

  entity_id?: string;

  event_type?: ActivityEventType;

  limit?: number;
}

export interface ActivityAdapter<TSource> {
  toActivity(source: TSource): ActivityItem;
}




