"use client";

import { Bell, Building2, FileText, Wrench, CheckCircle2 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const notifications = [
  {
    icon: Building2,
    title: "New Company Registered",
    time: "2 min ago",
    color: "text-blue-600",
  },
  {
    icon: FileText,
    title: "Invoice Generated",
    time: "15 min ago",
    color: "text-green-600",
  },
  {
    icon: Wrench,
    title: "Asset Assigned",
    time: "42 min ago",
    color: "text-orange-500",
  },
  {
    icon: CheckCircle2,
    title: "Contract Approved",
    time: "1 hour ago",
    color: "text-emerald-600",
  },
];

export default function NotificationDrawer({
  open,
  onClose,
}: Props) {
  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 h-screen w-96 bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="border-b p-6">
          <div className="flex items-center gap-3">
            <Bell className="text-blue-600" />
            <h2 className="text-xl font-bold">Notifications</h2>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Latest CRM activities
          </p>
        </div>

        <div className="space-y-4 p-5">
          {notifications.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-xl border bg-slate-50 p-4 hover:border-blue-500 hover:bg-white"
              >
                <div className="flex gap-3">
                  <Icon className={item.color} size={18} />

                  <div>
                    <p className="font-semibold">{item.title}</p>

                    <p className="text-xs text-slate-500">
                      {item.time}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}