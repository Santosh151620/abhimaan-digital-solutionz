"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface Payment {
  id: string;
  created_at: string;

  client_id: string;
  project_id: string | null;

  amount: number;

  status: "pending" | "paid" | "failed" | "refunded";

  method: "cash" | "card" | "bank_transfer" | "upi";

  reference: string | null;

  notes: string | null;
}

interface PaymentModalProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const supabase = createClient();

const STATUS_OPTIONS: Payment["status"][] = [
  "pending",
  "paid",
  "failed",
  "refunded",
];

const METHOD_OPTIONS: Payment["method"][] = [
  "cash",
  "card",
  "bank_transfer",
  "upi",
];

export default function PaymentModal({
  payment,
  isOpen,
  onClose,
  onUpdated,
}: PaymentModalProps) {
  const [status, setStatus] =
    useState<Payment["status"]>("pending");

  const [method, setMethod] =
    useState<Payment["method"]>("cash");

  const [amount, setAmount] = useState<number>(0);

  const [reference, setReference] = useState("");

  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!payment) return;

    setStatus(payment.status);
    setMethod(payment.method);
    setAmount(payment.amount);
    setReference(payment.reference ?? "");
    setNotes(payment.notes ?? "");
  }, [payment]);

  if (!isOpen || !payment) return null;

  async function handleSave() {
    if (!payment) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from("payments")
        .update({
          status,
          method,
          amount,
          reference,
          notes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", payment.id);

      if (!error) {
        onUpdated();
        onClose();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-slate-950">
              {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

          <div>
            <h2 className="text-2xl font-bold text-white">
              Payment Details
            </h2>

            <p className="text-sm text-slate-400">
              Update payment status, method and details
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
          >
            Close
          </button>

        </div>

        {/* BODY */}
        <div className="grid gap-8 p-6 lg:grid-cols-2">

          {/* LEFT SIDE */}
          <div className="space-y-4">

            {/* AMOUNT */}
            <div>
              <label className="text-xs text-slate-500">
                Amount
              </label>

              <input
                type="number"
                value={amount}
                onChange={(e) =>
                  setAmount(Number(e.target.value))
                }
                className="w-full mt-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
              />
            </div>

            {/* STATUS */}
            <div>
              <label className="text-xs text-slate-500">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as Payment["status"]
                  )
                }
                className="w-full mt-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* METHOD */}
            <div>
              <label className="text-xs text-slate-500">
                Payment Method
              </label>

              <select
                value={method}
                onChange={(e) =>
                  setMethod(
                    e.target.value as Payment["method"]
                  )
                }
                className="w-full mt-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
              >
                {METHOD_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

          </div>
                          {/* RIGHT SIDE */}
          <div className="space-y-4">

            {/* REFERENCE */}
            <div>
              <label className="text-xs text-slate-500">
                Reference
              </label>

              <input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Transaction ID / Invoice Ref"
                className="w-full mt-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
              />
            </div>

            {/* NOTES */}
            <div>
              <label className="text-xs text-slate-500">
                Notes
              </label>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
                placeholder="Internal notes..."
                className="w-full mt-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
              />
            </div>

            {/* ACTIONS */}
            <div className="pt-4 flex gap-3">

              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 rounded-lg bg-cyan-600 py-2 text-white hover:bg-cyan-700"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>

              <button
                onClick={onClose}
                className="flex-1 rounded-lg bg-slate-900 py-2 text-white hover:bg-slate-800"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

        {/* FOOTER SPACING */}
        <div className="h-6" />

      </div>
    </div>
  );
}
