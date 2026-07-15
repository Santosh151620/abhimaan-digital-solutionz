'use client';

import { useState } from 'react';
import { updateLead } from '../api/lead.api';
import { LeadEntity } from '../types/lead.entity';

export function useUpdateLead() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (
    entityId: string,
    input: Partial<LeadEntity>
  ) => {
    try {
      setLoading(true);
      setError(null);

      return await updateLead(entityId, {
        entityId,
        title: input.title,
        email: input.email,
        phone: input.phone,
        status: input.status,
        source: input.source,
        score: input.score,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    loading,
    error,
  };
}





