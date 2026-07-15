'use server';

import { OpportunitiesServiceInstance } from '@/services/crm/OpportunitiesService';
import type { Opportunity } from '@/types/crm/Opportunities';

export async function listOpportunities() {
    return OpportunitiesServiceInstance.list();
}

export async function listArchivedOpportunities() {
    return OpportunitiesServiceInstance.listArchived();
}

export async function createOpportunity(
    data: Partial<Opportunity>
) {
    return OpportunitiesServiceInstance.create(data);
}

export async function updateOpportunity(
    id: string,
    data: Partial<Opportunity>
) {
    return OpportunitiesServiceInstance.update(id, data);
}

export async function deleteOpportunity(id: string) {
    return OpportunitiesServiceInstance.delete(id);
}

export async function restoreOpportunity(id: string) {
    return OpportunitiesServiceInstance.restore(id);
}