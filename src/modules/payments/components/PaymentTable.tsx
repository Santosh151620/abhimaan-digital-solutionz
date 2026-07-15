"use client";

import { useMemo, useState, useCallback, memo } from "react";
//import PaymentModal, { type Payment } from "@/components/dashboard/PaymentModal";
import PaymentModal from "./PaymentModal";
import type { Payment } from "../types/payment";


export type { Payment } from "../types/payment";

interface PaymentTableProps {
  payments: Payment[];
}

function PaymentTable({ payments }: PaymentTableProps) {
  const [rows, setRows] = useState<Payment[]>(payments);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const totalRevenue = useMemo(() => {
    return rows.reduce((sum, p) => {
      if (p.status !== "paid") return sum;
      return sum + Number(p.amount);
    }, 0);
  }, [rows]);

  const handleUpdated = useCallback((updated: Payment) => {
    setRows((prev) => {
      const idx = prev.findIndex((p) => p.id === updated.id);
      if (idx === -1) return prev;

      const next = [...prev];
      next[idx] = updated;
      return next;
    });

    setSelectedPayment(updated);
  }, []);

  const openModal = useCallback((payment: Payment) => {
    setSelectedPayment(payment);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedPayment(null);
  }, []);

  const formatCurrency = useCallback((value: number) => {
    return value.toLocaleString("en-IN");
  }, []);

  const formatDate = useCallback((dateStr: string) => {
    return dateStr ? dateStr.split("T")[0] : "-";
  }, []);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Payments</h2>

            <p className="text-sm text-slate-400">
              Total Paid Revenue: â‚¹{formatCurrency(totalRevenue)}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-900">
              <tr className="text-left text-slate-400">
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Method</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No payments found.
                  </td>
                </tr>
              )}

              {rows.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-t border-white/5 hover:bg-slate-900/40"
                >
                  <td className="px-5 py-4 text-slate-300">
                    {payment.client_id}
                  </td>

                  <td className="px-5 py-4 font-medium text-white">
                    â‚¹{formatCurrency(Number(payment.amount))}
                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    {payment.method}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-cyan-600/20 px-3 py-1 text-xs text-cyan-300">
                      {payment.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-400">
                    {formatDate(payment.created_at)}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => openModal(payment)}
                      className="rounded-lg bg-cyan-600 px-3 py-2 text-white hover:bg-cyan-700"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PaymentModal
        payment={selectedPayment}
        isOpen={selectedPayment !== null}
        onClose={closeModal}
        onUpdated={handleUpdated}
      />
    </>
  );
}

export default memo(PaymentTable);





