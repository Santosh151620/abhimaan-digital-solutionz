'use client';

import { useCallback, useEffect, useState } from 'react';
import { LeadEntity } from '../types/lead.entity';

export function useLeads() {
  const [leads, setLeads] = useState<LeadEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/leads');

      if (!res.ok) {
        throw new Error('Failed to fetch leads');
      }

      const data = (await res.json()) as LeadEntity[];

      setLeads(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

 useEffect(() => {
  const timer = setTimeout(() => {
    void fetchLeads();
  }, 0);

  return () => clearTimeout(timer);
}, [fetchLeads]);

  return {
    leads,
    loading,
    error,
    refetch: fetchLeads,
  };
}
