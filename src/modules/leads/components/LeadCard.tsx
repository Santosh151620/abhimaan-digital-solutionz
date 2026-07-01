'use client';

import { LeadEntity } from '../types/lead.entity';

interface Props {
  lead: LeadEntity;
  onClick?: (lead: LeadEntity) => void;
}

export function LeadCard({ lead, onClick }: Props) {
  return (
    <div
      onClick={() => onClick?.(lead)}
      className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition"
    >
      <div className="flex justify-between items-center">
        <div className="font-semibold">{lead.title}</div>
        <span className="text-xs px-2 py-1 rounded bg-gray-100">
          {lead.status}
        </span>
      </div>

      <div className="text-sm text-gray-500 mt-1">
        {lead.email || 'No email'}
      </div>

      <div className="text-xs text-gray-400 mt-1">
        ID: {lead.entityId}
      </div>
    </div>
  );
}