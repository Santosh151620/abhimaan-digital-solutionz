'use client';

import { useEffect, useState } from 'react';
import { LeadEntity } from '../types/lead.entity';
import { fetchLead } from '../api/lead.api';

interface Props {
  entityId: string;
}

export function LeadEntityPanel({ entityId }: Props) {
  const [lead, setLead] = useState<LeadEntity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchLead(entityId);
      setLead(data);
      setLoading(false);
    };

    load();
  }, [entityId]);

  if (loading) return <div className="p-4">Loading lead...</div>;
  if (!lead) return <div className="p-4">Lead not found</div>;

  return (
    <div className="p-4 space-y-2 border rounded-md">
      <div className="text-lg font-semibold">{lead.title}</div>
      <div className="text-sm">Status: {lead.status}</div>
      <div className="text-sm">Email: {lead.email}</div>
      <div className="text-sm">Phone: {lead.phone}</div>
      <div className="text-xs text-gray-400">
        Updated: {lead.updatedAt}
      </div>
    </div>
  );
}