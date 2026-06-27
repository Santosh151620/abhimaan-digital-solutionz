import PaymentTable from "@/components/dashboard/PaymentTable";
import PaymentModal from "@/components/dashboard/PaymentModal";

import { createClient } from "@/lib/supabase/server";

import type { Payment } from "@/components/dashboard/PaymentTable";

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
    notes: p.notes ?? null,
  }));

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Payments
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Manage all payments and transaction records
        </p>
      </div>

      {/* TABLE */}
      <PaymentTable payments={payments} />
      "use client";

import { useState } from "react";

import PaymentTable from "@/components/dashboard/PaymentTable";
import PaymentModal from "@/components/dashboard/PaymentModal";

import type { Payment } from "@/components/dashboard/PaymentTable";

export default function PaymentsPageClient({
  initialPayments,
}: {
  initialPayments: Payment[];
}) {
  const [payments, setPayments] =
    useState<Payment[]>(initialPayments);

  const [selectedPayment, setSelectedPayment] =
    useState<Payment | null>(null);

  const [showModal, setShowModal] = useState(false);

  function handleOpen(payment: Payment) {
    setSelectedPayment(payment);
    setShowModal(true);
  }

  function handleClose() {
    setSelectedPayment(null);
    setShowModal(false);
  }

  async function refresh() {
    // simple reload pattern (stable + production-safe)
    window.location.reload();
  }

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Payments
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Manage all payments and transaction records
        </p>
      </div>

      {/* TABLE */}
      <PaymentTable
        payments={payments}
      />

      {/* MODAL */}
      <PaymentModal
        payment={selectedPayment}
        isOpen={showModal}
        onClose={handleClose}
        onUpdated={refresh}
      />

    </div>
  );
}