'use client';

import { useLeads } from '../hooks/useLeads';

export function LeadList() {
  const { leads, loading, error } = useLeads();

  if (loading) return <div className="p-4">Loading leads...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="space-y-2">
      {leads.map((lead) => (
        <div
          key={lead.entityId}
          className="border rounded-md p-3 flex flex-col"
        >
          <div className="font-medium">{lead.title}</div>
          <div className="text-sm text-gray-500">{lead.status}</div>
          {lead.email && (
            <div className="text-xs text-gray-400">{lead.email}</div>
          )}
        </div>
      ))}
    </div>
  );
}





