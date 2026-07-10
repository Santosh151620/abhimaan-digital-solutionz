export type ClientStatus =
  | "active"
  | "inactive"
  | "paused";

export interface Client {
  id: string;

  created_at: string;

  updated_at: string;

  full_name: string;

  company_name: string | null;

  email: string | null;

  phone: string | null;

  notes: string | null;

  converted_from_lead_id: string | null;

  status: ClientStatus;
}

export interface ClientNote {
  id: string;

  client_id: string;

  note: string;

  created_at: string;
}

export interface ClientSummary {
  total_clients: number;

  active_clients: number;

  inactive_clients: number;

  paused_clients: number;
}
