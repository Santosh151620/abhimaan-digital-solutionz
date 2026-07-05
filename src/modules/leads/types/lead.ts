export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "won"
  | "lost";

export interface Lead {
  id: string;

  full_name: string;

  email: string;

  phone?: string | null;

  company?: string | null;

  service_interest?: string | null;

  message?: string | null;

  source?: string | null;

  status: LeadStatus;

  client_id?: string | null;

  created_at?: string;
}

export interface LeadTimeline {
  id: string;

  lead_id: string;

  message: string;

  event_type:
    | "created"
    | "updated"
    | "status_changed"
    | "note";

  created_at?: string;
}
