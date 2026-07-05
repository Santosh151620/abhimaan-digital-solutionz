'use client';

import { LeadStatus } from '../types/lead.entity';
import { getLeadStatusLabel } from '../utils/lead.status';

interface Props {
  status: LeadStatus;
}

export function LeadStatusBadge({ status }: Props) {
  return (
    <span className="text-xs px-2 py-1 rounded bg-gray-200">
      {getLeadStatusLabel(status)}
    </span>
  );
}
