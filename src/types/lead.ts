export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "won"
  | "lost";

export interface Lead {
  id: string;

  created_at: string;

  full_name: string;

  email: string;

  phone: string | null;

  company: string | null;

  service_interest: string | null;

  message: string | null;

  source: string | null;

  status: LeadStatus;

  client_id: string | null;
}

export interface LeadNote {
  id: string;

  lead_id: string;

  note: string;

  created_at: string;
}

export type LeadTimelineEvent =
  | "created"
  | "status_change"
  | "note"
  | "conversion"
  | "updated";

export interface LeadTimeline {
  id: string;

  lead_id: string;

  message: string;

  event_type: LeadTimelineEvent;

  created_at: string;
}

export interface LeadFilters {
  search: string;

  status: LeadStatus | "all";
}

export interface LeadStats {
  total: number;

  new: number;

  contacted: number;

  qualified: number;

  proposal: number;

  won: number;

  lost: number;
}

export interface ConvertLeadResponse {
  success: boolean;

  clientId: string;

  leadId: string;
}