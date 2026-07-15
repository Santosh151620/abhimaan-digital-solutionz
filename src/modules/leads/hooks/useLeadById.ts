'use client';

import { useEffect, useState } from 'react';
import { LeadEntity } from '../types/lead.entity';
import { fetchLead } from '../api/lead.api';

export function useLeadById(entityId: string) {
  const [lead, setLead] = useState<LeadEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!entityId) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchLead(entityId);
        setLead(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load lead');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [entityId]);

  return {
    lead,
    loading,
    error,
  };
}





