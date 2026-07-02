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
  onUpdated: (payment: Payment) => void;
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

  const [amount, setAmount] = useState(0);

  const [reference, setReference] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [saving, setSaving] =
    useState(false);

useEffect(() => {
  if (!payment) return;

  setForm((prev) => ({
    ...prev,
    status: payment.status,
    method: payment.method,
    amount: payment.amount,
    reference: payment.reference ?? "",
    notes: payment.notes ?? "",
  }));
}, [payment]);


  if (!isOpen || !payment) {
    return null;
  }

  async function handleSave() {
    if (!payment) return;

    const currentPayment = payment; // FIX: snapshot non-null value

    setSaving(true);

    try {
      const updates = {
        status,
        method,
        amount,
        reference,
        notes,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("payments")
        .update(updates)
        .eq("id", currentPayment.id);

      if (error) {
        console.error(error);
        return;
      }

      onUpdated({
        ...currentPayment,
        status,
        method,
        amount,
        reference,
        notes,
      });

      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-slate-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2 className="text-2xl font-bold text-white">
            Edit Payment
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
          >
            Close
          </button>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Amount
              </label>

              <input
                type="number"
                value={amount}
                onChange={(e) =>
                  setAmount(Number(e.target.value))
                }
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as Payment["status"]
                  )
                }
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
              >
                {STATUS_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Method
              </label>

              <select
                value={method}
                onChange={(e) =>
                  setMethod(
                    e.target.value as Payment["method"]
                  )
                }
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
              >
                {METHOD_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Reference
              </label>

              <input
                value={reference}
                onChange={(e) =>
                  setReference(e.target.value)
                }
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Notes
              </label>

              <textarea
                rows={6}
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-5 py-2 text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-cyan-600 px-5 py-2 text-white hover:bg-cyan-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}