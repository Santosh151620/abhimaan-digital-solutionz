export interface Payment {
  id: string;

  client_id?: string;
  project_id?: string;

  amount: number;

  currency?: string;

  status:
    | "pending"
    | "paid"
    | "failed"
    | "refunded";

  payment_method?: string;

  reference_number?: string;

  created_at: string;
  updated_at?: string;
}
