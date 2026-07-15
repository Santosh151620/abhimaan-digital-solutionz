'use client';

import { useQuery } from '@tanstack/react-query';
import type { Company } from '@/types/crm/Companies';

async function fetchCompanies(): Promise<Company[]> {
    const response = await fetch('/api/crm/companies');

    if (!response.ok) {
        throw new Error('Failed to load companies');
    }

    return response.json();
}

export function useCompanies() {
    return useQuery({
        queryKey: ['companies'],
        queryFn: fetchCompanies,
    });
}




