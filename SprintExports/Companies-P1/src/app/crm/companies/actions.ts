'use server';

import { CompaniesServiceInstance } from '@/services/crm/CompaniesService';

export async function listCompanies() {
    return CompaniesServiceInstance.list();
}

export async function createCompanies(data: unknown) {
    return CompaniesServiceInstance.create(data);
}

export async function updateCompanies(id: string, data: unknown) {
    return CompaniesServiceInstance.update(id, data);
}

export async function deleteCompanies(id: string) {
    return CompaniesServiceInstance.delete(id);
}
