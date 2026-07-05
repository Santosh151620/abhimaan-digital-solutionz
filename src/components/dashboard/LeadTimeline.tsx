"use client";

import { memo, useCallback, useEffect, useState } from "react";

type TimelineEvent = {
  id: string;
  title: string;
  created_at?: string;
};

interface LeadTimelineProps {
  leadId: string;
}

function LeadTimeline({ leadId }: LeadTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTimeline = useCallback(async () => {
    if (!leadId) {
      setEvents([]);
      return;
    }

    setLoading(true);

    try {
      /**
       * Phase 6
       * Timeline service not implemented yet.
       * Keep component stable without fake async data.
       */
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    void loadTimeline();
  }, [loadTimeline]);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-white">
        Lead Timeline
      </h3>

      {loading && (
        <div className="rounded-lg border border-white/10 bg-slate-900 p-4 text-sm text-slate-400">
          Loading timeline...
        </div>
      )}

      {!loading && events.length === 0 && (
        <div className="rounded-lg border border-dashed border-white/10 bg-slate-900 p-6 text-center text-sm text-slate-500">
          Timeline feature will be available in a future phase.
        </div>
      )}

      {!loading &&
        events.map((event) => (
          <div
            key={event.id}
            className="rounded-lg border border-white/10 bg-slate-900 p-4"
          >
            <div className="font-medium text-white">
              {event.title}
            </div>

            {event.created_at && (
              <div className="mt-1 text-xs text-slate-500">
                {event.created_at.split("T")[0]}
              </div>
            )}
          </div>
        ))}
    </div>
  );
}

export default memo(LeadTimeline);
