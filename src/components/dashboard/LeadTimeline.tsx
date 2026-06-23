"use client";

import { useEffect, useState } from "react";

type Event = {
  id: string;
  action: string;
  from_status: string | null;
  to_status: string | null;
  created_at: string;
};

export default function LeadTimeline({ leadId }: { leadId: string }) {
  const [events, setEvents] = useState<Event[]>([]);

  const fetchTimeline = async () => {
    const res = await fetch(`/api/leads/${leadId}/timeline`);
    const data = await res.json();
    setEvents(data || []);
  };

  useEffect(() => {
    fetchTimeline();
  }, [leadId]);

  return (
    <div className="space-y-3">
      {events.length === 0 && (
        <p className="text-sm text-slate-500">
          No activity yet.
        </p>
      )}

      {events.map((e) => (
        <div
          key={e.id}
          className="bg-slate-900 border border-slate-800 rounded-xl p-3"
        >
          <p className="text-sm text-white">{e.action}</p>

          {e.from_status && e.to_status && (
            <p className="text-xs text-slate-400 mt-1">
              {e.from_status} → {e.to_status}
            </p>
          )}

          <p className="text-[10px] text-slate-500 mt-1">
            {e.created_at.split("T")[0]}
          </p>
        </div>
      ))}
    </div>
  );
}