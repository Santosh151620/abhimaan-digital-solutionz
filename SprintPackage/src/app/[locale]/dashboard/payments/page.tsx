import { PaymentTable } from "@/modules/payments/components";
import { createClient } from "@/lib/supabase/server";
import type { Payment } from "@/modules/payments/components";

export default async function PaymentsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const payments: Payment[] = (data ?? []).map((p) => ({
    id: p.id,
    created_at: p.created_at,
    project_id: p.project_id,
    amount: Number(p.amount),
    status: p.status,
    client_id: p.client_id ?? "",
    method: p.method ?? "unknown",
    payment_date: p.payment_date ?? null,
    reference: p.reference ?? "",
    notes: p.notes ?? null,
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Payments
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Manage all payments and transaction records
        </p>
      </div>

      <PaymentTable payments={payments} />
    </div>
  );
}
