'use client';

import { useState } from 'react';
import { createLead } from '../api/lead.api';
import { LeadEntity } from '../types/lead.entity';

export function useCreateLead() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (
    input: Omit<LeadEntity, 'entityType' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      setLoading(true);
      setError(null);

      return await createLead({
        entityId: input.entityId,
        title: input.title,
        email: input.email,
        phone: input.phone,
        status: input.status,
        source: input.source,
        score: input.score,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Create failed');
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





