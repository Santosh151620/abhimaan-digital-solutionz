export interface Client {
  id: string;

  full_name: string | null;
  email: string | null;
  phone: string | null;

  company: string | null;
  website: string | null;

  industry: string | null;

  status: "active" | "inactive" | "paused";

  lead_id: string | null;

  assigned_to: string | null;

  created_at: string;
  updated_at: string;
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