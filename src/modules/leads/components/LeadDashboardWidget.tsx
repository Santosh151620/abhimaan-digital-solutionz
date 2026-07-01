'use client';

import { useLeads } from '../hooks/useLeads';
import {
  selectLeadCountByStatus,
  selectLeadScoreAverage,
} from '../selectors/lead.selectors';

export function LeadDashboardWidget() {
  const { leads, loading } = useLeads();

  if (loading) {
    return <div className="p-4">Loading metrics...</div>;
  }

  const newLeads = selectLeadCountByStatus(leads, 'new');
  const qualified = selectLeadCountByStatus(leads, 'qualified');
  const avgScore = selectLeadScoreAverage(leads);

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="border p-3 rounded-md">
        <div className="text-sm text-gray-500">New Leads</div>
        <div className="text-xl font-semibold">{newLeads}</div>
      </div>

      <div className="border p-3 rounded-md">
        <div className="text-sm text-gray-500">Qualified</div>
        <div className="text-xl font-semibold">{qualified}</div>
      </div>

      <div className="border p-3 rounded-md">
        <div className="text-sm text-gray-500">Avg Score</div>
        <div className="text-xl font-semibold">
          {avgScore.toFixed(1)}
        </div>
      </div>
    </div>
  );
}