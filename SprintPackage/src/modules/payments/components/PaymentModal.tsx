"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Payment } from "../types/payment";

interface PaymentModalProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (payment: Payment) => void;
}

const supabase = createClient();

function PaymentModal({
  payment,
  isOpen,
  onClose,
  onUpdated,
}: PaymentModalProps) {
  const [status, setStatus] = useState<Payment["status"]>("pending");
  const [method, setMethod] = useState<Payment["method"]>("cash");
  const [amount, setAmount] = useState<number>(0);
  const [reference, setReference] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [saving, setSaving] = useState(false);

 useEffect(() => {
  if (!payment) return;

  const { status, method, amount, reference, notes } = payment;

  queueMicrotask(() => {
    setStatus(status);
    setMethod(method);
    setAmount(amount ?? 0);
    setReference(reference ?? "");
    setNotes(notes ?? "");
  });
}, [payment]);

  const handleSave = useCallback(async () => {
    if (!payment) return;

    const current = payment;

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
        .eq("id", current.id);

      if (error) {
        console.error(error);
        return;
      }

      onUpdated({
        ...current,
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
  }, [payment, status, method, amount, reference, notes, onUpdated, onClose]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isOpen || !payment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-slate-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2 className="text-2xl font-bold text-white">Edit Payment</h2>

          <button
            onClick={handleClose}
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
                onChange={(e) => setAmount(Number(e.target.value))}
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
                  setStatus(e.target.value as Payment["status"])
                }
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
              >
                {["pending", "paid", "failed", "refunded"].map((item) => (
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
                  setMethod(e.target.value as Payment["method"])
                }
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
              >
                {["cash", "card", "bank_transfer", "upi"].map((item) => (
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
                onChange={(e) => setReference(e.target.value)}
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
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-4">
          <button
            onClick={handleClose}
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

export default memo(PaymentModal);
