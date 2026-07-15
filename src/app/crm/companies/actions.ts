'use server';

import { CompaniesServiceInstance } from '@/services/crm/CompaniesService';
import type { CompanyDetails } from '@/types/crm/Companies';

export async function listCompanies() {
    return CompaniesServiceInstance.list();
}

export async function listArchivedCompanies() {
    return CompaniesServiceInstance.listArchived();
}

export async function createCompanies(
    data: Partial<CompanyDetails>
) {
    return CompaniesServiceInstance.create(data);
}

export async function updateCompanies(
    id: string,
    data: Partial<CompanyDetails>
) {
    return CompaniesServiceInstance.update(id, data);
}

export async function deleteCompanies(id: string) {
    return CompaniesServiceInstance.delete(id);
}

export async function restoreCompanies(id: string) {
    return CompaniesServiceInstance.restore(id);
}




