"use client";

import { useMemo, useState } from "react";
import PaymentModal, { type Payment } from "@/components/dashboard/PaymentModal";

export type { Payment };

interface PaymentTableProps {
  payments: Payment[];
}

export default function PaymentTable({
  payments,
}: PaymentTableProps) {
  const [rows, setRows] = useState(payments);

  const [selectedPayment, setSelectedPayment] =
    useState<Payment | null>(null);

  const totalRevenue = useMemo(() => {
    return rows
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + Number(p.amount), 0);
  }, [rows]);

  function handleUpdated(updated: Payment) {
    setRows((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );

    setSelectedPayment(updated);
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Payments
            </h2>

            <p className="text-sm text-slate-400">
              Total Paid Revenue: ₹
              {totalRevenue.toLocaleString("en-IN")}
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
                <th className="px-5 py-3 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-t border-white/5 hover:bg-slate-900/40"
                >
                  <td className="px-5 py-4 text-slate-300">
                    {payment.client_id}
                  </td>

                  <td className="px-5 py-4 font-medium text-white">
                    ₹
                    {Number(payment.amount).toLocaleString("en-IN")}
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
                    {payment.created_at.split("T")[0]}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setSelectedPayment(payment)}
                      className="rounded-lg bg-cyan-600 px-3 py-2 text-white hover:bg-cyan-700"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-slate-500"
                  >
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PaymentModal
        payment={selectedPayment}
        isOpen={selectedPayment !== null}
        onClose={() => setSelectedPayment(null)}
        onUpdated={handleUpdated}
      />
    </>
  );
}