'use client';

import { useCallback, useEffect, useState } from 'react';

type TimelineEvent = {
  id: string;
  title: string;
};

export default function LeadTimeline({ leadId }: { leadId: string }) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  const fetchTimeline = useCallback(async () => {
    if (!leadId) return;

    // TODO: replace with service call
    const data: TimelineEvent[] = [];

    setEvents(data);
  }, [leadId]);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchTimeline();
    });
  }, [fetchTimeline]);

  return (
    <div>
      {events.map((e) => (
        <div key={e.id}>{e.title}</div>
      ))}
    </div>
  );
}